// src/index.js
import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import sql from "sql-bricks";
import cors from "cors";
import {dbClient} from "./db";
import {Auth, User} from "./models";
import {generateRandomString, generateSalt, shaPasswordWithSalt} from "./security/SecurityUtils";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {
    accessTokenCookieOptions,
    refreshTokenCookieOptions
} from "./security/token-helper-functions"
import {Jwt} from "./security/Jwt";

dotenv.config();

async function sanityCheck() {
    const results = await dbClient.query("SELECT NOW()");
    console.log(results.rows);
}

async function getAllUsers() {
    try {
        return await queryDb<User[]>(sql.select().from('users').toString());
    } catch (err) {
        console.error("Error getting users:", err);
        return [];
    }
}

async function createUser({username, email}: User): Promise<User | undefined> {
    try {
        const query = sql.insertInto('users', {username, email}).toString() + "RETURNING *"
        const result: User[] = await queryDb<User[]>(query);
        return result[0];
    } catch (err) {
        console.error("Error creating user:", err);
        return undefined;
    }
}

async function createUserAuth(userId: number, password: string): Promise<Auth> {
    try {
        const salt = generateSalt();
        const saltedPasswordAfterSha = shaPasswordWithSalt(password, salt);
        const query = sql.insertInto('auth', {
            user_id: userId,
            salt: salt,
            password: saltedPasswordAfterSha
        }).toString() + "RETURNING *"
        const result: Auth[] = await queryDb<Auth[]>(query);
        return result[0];
    } catch (err) {
        console.error("Error creating auth:", err);
        throw (err);
    }
}

async function getUserByUsername(username: string): Promise<User> {
    try {
        const query = sql.select().from('users').where(sql.eq('username', username)).toString()
        console.log(query);
        const result: User[] = await queryDb<User[]>(query);
        console.log(result);
        return result[0];
    } catch (err) {
        console.error("Error getting user by username:", err);
        throw (err);
    }
}

async function getUserAuthByUserId(userId: number): Promise<any> {
    try {
        const query = sql.select().from('auth').where(sql.eq('user_id', userId)).toString()
        const result: Auth[] = await queryDb<Auth[]>(query);
        return result[0];
    } catch (err) {
        console.error("Error getting user by username:", err);
        throw (err);
    }
}

async function queryDb<T>(query: string) {
    try {
        const results = await dbClient.query(query);
        return results.rows as T;
    } catch (err) {
        console.error("Error querying db:", err);
        throw (err);
    }
}

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use((req: Request, res: Response, next: Function) => {
    console.log('middleware');
    console.log(req.cookies);
    next();
});

app.get("/ping", (req: Request, res: Response) => {
    console.log('got ping')
    res.send({response: "pong", date: new Date()});
});

app.post('/setCookies', (req: Request, res: Response) => {
    res.status(200).cookie('test', 'test-value', {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
    });
    res.send({response: "setCookies", date: new Date()});
})


app.get("/users", async (req: Request, res: Response) => {
    const allUsers = await getAllUsers();
    res.send(allUsers);
});

app.post("/register", async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    try {
        const createdUser = await createUser({username, email});
        const userAlreadyExists = createdUser === undefined;
        if (userAlreadyExists) {
            res.status(409).send({message: `User ${username} already exists.`})
            return;
        }
        if (createdUser.id === undefined) {
            res.status(500).send({message: "Error creating user:"})
            return;
        }
        const auth = await createUserAuth(createdUser.id, password);
        res.send({
            message: "Created user successfully",
            user: createdUser
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send({message: "Error registering user:", error: err})
    }
});

async function loginWithUserName(username: string, password: string, res: Response): Promise<void> {
    const user = await getUserByUsername(username);

    if (user === undefined) {
        res.status(404).send({message: `User ${username} not found.`})
        return;
    }
    let auth;
    if (user.id) {
        auth = await getUserAuthByUserId(user.id);
    }
    if (auth === undefined) {
        res.status(404).send({message: `Auth for ${username} not found.`})
        return;
    }
    const saltedPasswordAfterSha = shaPasswordWithSalt(password, auth.salt);
    if (saltedPasswordAfterSha !== auth.password) {
        res.status(401).send({message: `Username or password incorrect.`})
        console.log("Username or password incorrect.");
        return;
    }
    const refreshToken = new Jwt(
        {
            typ: '',
            alg: 'sha'
        },
        {
            id: user.id,
            role: 'user',
            nonce: 'rt_' + generateRandomString(5)
        })
    const accessToken = new Jwt(
        {
            typ: '',
            alg: 'sha'
        },
        {
            id: user.id,
            role: 'user',
            nonce: 'at_' + generateRandomString(5)
        })
    refreshToken.sign(process.env.JWT_SECRET_KEY);
    accessToken.sign(process.env.JWT_SECRET_KEY);
    res.status(200)
        .cookie("RT", refreshToken.encodedAndSigned(), refreshTokenCookieOptions())
        .cookie("AT", accessToken.encodedAndSigned(), accessTokenCookieOptions())
        .send({message: "Login successful", user: user, logged_in: true});
    return;
}

app.post("/login", async (req: Request, res: Response) => {
        const {username, password} = req.body;
        const refreshToken = req.cookies.RT;
        const accessToken = req.cookies.AT;
        console.log('RT', refreshToken);
        console.log('AT', accessToken);
        try {
            if (username && password) {
                await loginWithUserName(username, password, res);
                return;
            }

        } catch (err) {
            throw err;
        }
    }
)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});