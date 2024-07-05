// src/index.js
import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import sql from "sql-bricks";
import cors from "cors";
import {dbClient} from "./db";
import {User} from "./models";

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

async function queryDb<T>(query: string) {
    try {
        const results = await dbClient.query(query);
        return results.rows as T;
    } catch (err) {
        console.error("Error querying db:", err);
        return
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


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});