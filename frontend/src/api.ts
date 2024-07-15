import { User } from "./models/models";
import axios from "axios";

import { ENV } from "./env";

export async function ping(): Promise<object> {
	const response = await axios.get(`${ENV.VITE_API_URL}/ping`, {withCredentials: true});
	return response.data;
}

export async function setCookies():Promise<object>{
    const response = await axios.post(`${ENV.VITE_API_URL}/setCookies`,{},{withCredentials: true});
    return response.data;
}

export async function getAllUsers(): Promise<User[]> {
	const response = await axios.get<User[]>(`${ENV.VITE_API_URL}/users`);
	return response.data;
}

//todo: fix signature and return type
export async function registerUser(user: User): Promise<User> {
    const response = await axios.post<User>(`${ENV.VITE_API_URL}/register`, user);
    return response.data;
}

export async function loginUser(user: User): Promise<User> {
    const response = await axios.post<User>(`${ENV.VITE_API_URL}/login`, user);
    return response.data;
}