// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { log } from "console";
import { Client } from "pg";
import sql from "sql-bricks";
import cors from "cors";
import { Expense } from "./models";
dotenv.config();
const client = new Client(process.env.DATABASE_URL);

async function sanityCheck() {
	const results = await client.query("SELECT NOW()");
	console.log(results.rows);
}

async function getAllUsers() {
	try {
		const query = sql.select().from('users').toString();
		const results = await client.query(query);
		return results.rows;
	} catch (err) {
		console.error("Error getting users:", err);
		throw err;
	}
}

async function getExpensesByUserId(id: number) {
	try {
		const query = sql.select().from("expenses").where("user_id", id).toString();
		const results = await client.query(query);
		return results.rows;
	} catch (err) {
		console.error("Error getting expenses:", err);
		throw err;
	}
}

const initDb = async () => {
	
	try {
		await client.connect();
		await sanityCheck();
	} catch (err) {
		console.error("error executing query:", err);
	} 
};

initDb();

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
	res.send({ response: "pong", date: new Date() });
});

app.post("/expenses", async (req: Request, res: Response) => {
	const expense = req.body as Expense;
	console.log("expense", expense);
	res.send(`Expense ${expense.amount} added!`);
	try {
		const query = sql
			.insert("expenses", { amount: expense.amount, user_id: expense.user_id })
			.toString();
		const result = await client.query(query);
		console.log(result.rows);
	} catch (err) {
		console.error("Error creating expense:", err);
	}
});

app.get("/users", async (req: Request, res: Response) => {
	const allUsers = await getAllUsers();
	res.send(allUsers);
});

app.get("/expenses/:id", async (req: Request, res: Response) => {
	const id = parseInt(req.params.id);
	const allExpenses = await getExpensesByUserId(id);
	res.send(allExpenses);
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
