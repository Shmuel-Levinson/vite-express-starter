import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
export const dbClient = new Client(process.env.DATABASE_URL);
initDb();
async function initDb(){
    try {
        await dbClient.connect();
        // await sanityCheck();
    } catch (err) {
        console.error("error executing query:", err);
    }
}