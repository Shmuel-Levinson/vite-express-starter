import { Expense, User } from "./models/models";
import axios from "axios";

import { ENV } from "./env";

export async function ping(): Promise<object> {
	const response = await axios.get(`http://localhost:5000/ping`);
	return response.data;
}

export async function createExpense(expense: Expense): Promise<Expense> {
    const response = await axios.post(`${ENV.VITE_API_URL}/expenses`, expense);
	return response.data;
}

export async function getAllUsers(): Promise<User[]> {
	const response = await axios.get<User[]>(`${ENV.VITE_API_URL}/users`);
	return response.data;
}

export async function getExpenses(userId: number): Promise<Expense[]> {
	const response = await axios.get<Expense[]>(`${ENV.VITE_API_URL}/expenses/${userId}`);
	return response.data;
}
