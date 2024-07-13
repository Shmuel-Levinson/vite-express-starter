import { User } from "./models/models";
import axios from "axios";

import { ENV } from "./env";

export async function ping(): Promise<object> {
	const response = await axios.get(`http://localhost:5000/ping`);
	return response.data;
}

export async function getAllUsers(): Promise<User[]> {
	const response = await axios.get<User[]>(`${ENV.VITE_API_URL}/users`);
	return response.data;
}

export async function registerUser(user: User): Promise<User> {
    const response = await axios.post<User>(`${ENV.VITE_API_URL}/register`, user);
    return response.data;
}

export async function loginUser(user: User): Promise<User> {
    const response = await axios.post<User>(`${ENV.VITE_API_URL}/login`, user);
    return response.data;
}