// src/index.js
import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import sql from "sql-bricks";
import cors from "cors";
import {dbClient} from "./db";
import {Auth, User} from "./models";
import {generateRandomString, generateSalt, shaPasswordWithSalt} from "./security/SecurityUtils";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {accessTokenCookieOptions, refreshTokenCookieOptions} from "./security/token-helper-functions"
import {getTokenCookiesPair, Jwt} from "./security/Jwt";
import {isInThePast} from "./utils/DateUtils";

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

async function updateRefreshToken(userId: number, refreshToken: string) {
    try {
        const query = sql.update('auth').set({
            refresh_token: refreshToken,

        }).where(sql.eq('user_id', userId)).toString()
        console.log(query);
        return await queryDb<Auth[]>(query);
    } catch (err) {
        console.error("Error updating refresh token:", err);
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

async function getUserById(id: number) {
    try {
        const query = sql.select().from('users').where(sql.eq('id', id)).toString()
        console.log(query);
        const result: User[] = await queryDb<User[]>(query);
        console.log(result);
        return result[0];
    } catch (err) {
        console.error("Error getting user by id:", err);
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

function doesntRequireAuthenticationProcess(requestPath: string) {
    return ['*', '/test', '/login', '/register', '/logout','/checkUsername'].includes(requestPath);
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
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('authentication middleware');
    if (doesntRequireAuthenticationProcess(req.path)) {
        console.log('authentication process skipped for path', req.path);
        next();
        return
    }
    const refreshToken = req.cookies.RT;
    const accessToken = req.cookies.AT;
    const accessVerification = verifyAndDecodeToken(accessToken, res);
    if (accessVerification.verified) {
        console.log('access token is valid');
        // adding userId to the request body so that we can use it in the routes
        res.locals.userId = accessVerification.decodedToken.body.id;
        next();
        return
    }
    const refreshVerification = verifyAndDecodeToken(refreshToken, res);
    console.log('refresh verification', refreshVerification);
    if (refreshVerification.verified === false) {
        clearCookiesAndSendLogout(res)
        // res.status(401).send({message: refreshVerification.message, logged_in: false})
        return
    }
    // accessToken is not valid, but refreshToken is valid
    // we can use the refreshToken to get a new accessToken
    // and then use the new accessToken to access the endpoint
    const userId = refreshVerification.decodedToken.body.id;

    const {rtCookie, atCookie} = getTokenCookiesPair(userId);
    res.cookie("RT", rtCookie, refreshTokenCookieOptions()) // not sure that we should set this cookie in this case
    res.cookie("AT", atCookie, accessTokenCookieOptions())
    next();
});

app.get("/ping", (req: Request, res: Response) => {
    console.log('got ping')
    // console.log(req.body)
    console.log("locals in ping" , res.locals)
    const userId = res.locals.userId;
    res.send({response: "pong", userId: userId, date: new Date()});
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

app.post("/checkUsername", async (req: Request, res: Response) => {
    const {username} = req.body;
    try {
        const user = await getUserByUsername(username);
        if (user === undefined) {
            res.status(200).send({message: "Username is available", available: true});
        } else {
            res.status(200).send({message: "Username is taken", available: false});
        }
    } catch (err) {
        console.error("Error checking username:", err);
        res.status(500).send({message: "Error checking username"});
    }
});

app.post("/register", async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    try {
        const userAlreadyExists = await getUserByUsername(username);
        if (userAlreadyExists) {
            res.status(409).send({message: `User ${username} already exists.`})
            return;
        }
        const createdUser = await createUser({username, email});
        if (createdUser?.id === undefined) {
            res.status(500).send({message: "Error creating user:"})
            return;
        }
        await createUserAuth(createdUser.id, password);
        await logAuthenticatedUserIn(createdUser, res, true);

    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send({message: "Error registering user:", error: err})
    }
});

async function logAuthenticatedUserIn(user: User, res: Response, isRegistration = false) {

    const {rtCookie, atCookie} = getTokenCookiesPair(user.id!);
    await updateRefreshToken(user.id!, rtCookie);
    const body: { message: string, user: User, logged_in: boolean, is_registration?: boolean } = {
        message: "Login successful",
        user: user,
        logged_in: true,
    };
    if (isRegistration) {
        body.is_registration = true;
    }
    res.status(200)
    res.cookie("RT", rtCookie, refreshTokenCookieOptions())
    res.cookie("AT", atCookie, accessTokenCookieOptions())
    res.send(body);
}

async function loginWithUserName(username: string, password: string, res: Response): Promise<void> {
    const user = await getUserByUsername(username);

    if (user === undefined) {
        res.status(404).send({message: `User ${username} not found.`})
        return;
    }
    let auth;
    if (user.id) {
        auth = await getUserAuthByUserId(user.id);
    } else {
        res.status(404).send({message: `User ${username} not found.`})
        return
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
    await logAuthenticatedUserIn(user, res);
    return;
}

function verifyAndDecodeToken(token: string, res: Response<any, Record<string, any>>): {
    decodedToken?: any,
    verified?: boolean,
    message?: string
} {
    if(!token){
        return {verified: false, message: "Token missing."};
    }
    const signatureVerified = Jwt.verifySignature(token, process.env.JWT_SECRET_KEY);
    if (!signatureVerified) {
        console.log("---------Signature invalid.");
        return {verified: false, message: "Token signature invalid."};
        // res.status(401).send({message: "Token invalid.", logged_in: false})
        // return;
    }
    const decodedToken = Jwt.decodeHeaderAndBody(token);
    const tokenExpirationDate = new Date(decodedToken.body.expires);
    if (isInThePast(tokenExpirationDate)) {
        console.log("---------Token expired.");
        return {verified: false, message: "Token expired."};
        // res.status(401).send({message: "Token expired.", logged_in: false});
        // return;
    }
    return {decodedToken: decodedToken, verified: true};
}

async function loginWithRefreshToken(refreshToken: string, res: Response<any, Record<string, any>>) {
    if (!refreshToken) {
        res.status(401).send({message: "No auth token provided.", logged_in: false})
        return;
    }
    const verificationResult = verifyAndDecodeToken(refreshToken, res);
    if (verificationResult.verified === false) {
        res.status(401).send({message: verificationResult.message, logged_in: false})
    }
    const user = await getUserById(verificationResult.decodedToken.body.id);
    await logAuthenticatedUserIn(user, res);
    return;
}

app.post("/login", async (req: Request, res: Response) => {
        const {username, password} = req.body;
        const refreshToken = req.cookies.RT;
        const accessToken = req.cookies.AT;
        try {
            if (username && password) {
                await loginWithUserName(username, password, res);
                return;
            }
            await loginWithRefreshToken(refreshToken, res);
        } catch (err) {
            throw err;
        }
    }
)

function clearCookiesAndSendLogout(res: Response<any, Record<string, any>>) {
    res.status(200).clearCookie("RT").clearCookie("AT").send({message: "Logged out.", logged_in: false});
}

app.post("/logout", async (req: Request, res: Response) => {
    clearCookiesAndSendLogout(res);
})


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});