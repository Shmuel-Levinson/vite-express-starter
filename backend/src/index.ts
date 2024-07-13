// src/index.js
import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import sql from "sql-bricks";
import cors from "cors";
import {dbClient} from "./db";
import {User} from "./models";
import {applySha, generateSalt} from "./security/SecurityUtils";

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

async function createUser({username, email, password}: User): Promise<User | undefined> {
    try {
        const query = sql.insertInto('users', {username, email, password}).toString() + "RETURNING *"
        const result: User[] = await queryDb<User[]>(query);
        return result[0];
    } catch (err) {
        console.error("Error creating user:", err);
        throw (err);
    }
}

async function createUserAuth(user: User): Promise<any> {
    try {
        const salt = generateSalt();
        const saltedPasswordAfterSha = applySha(user.password + salt)
        const query = sql.insertInto('auth', {
            user_id: user.id,
            salt: salt,
            password: saltedPasswordAfterSha
        }).toString() + "RETURNING *"
        const result: User[] = await queryDb<User[]>(query);
        return result[0];
    } catch (err) {
        console.error("Error creating auth:", err);
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
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: Function) => {
    next();
});

app.get("/ping", (req: Request, res: Response) => {
    console.log('got ping')
    res.send({response: "pong", date: new Date()});
});


app.get("/users", async (req: Request, res: Response) => {
    const allUsers = await getAllUsers();
    res.send(allUsers);
});

app.post("/register", async (req: Request, res: Response) => {
    const {username, email, password} = req.body;
    try {
        const createdUser = await createUser({username, email, password});
        const userAlreadyExists = createdUser === undefined;
        if (userAlreadyExists) {
            res.status(409).send({response: `User ${username} already exists.`})
            return;
        }
        const auth = await createUserAuth(createdUser);
        res.send({
            message: "Created user successfully",
            user: createdUser
        });
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send({response: "error", error: err})
    }
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});