import { User } from "./models/models";
import axios from "axios";


const axiosInstance = axios.create({
    withCredentials: true,})
import { ENV } from "./env";

export async function ping(): Promise<object> {
	const response = await axiosInstance.get(`${ENV.VITE_API_URL}/ping`);
	return response.data;
}

export async function setCookies():Promise<object>{
    const response = await axiosInstance.post(`${ENV.VITE_API_URL}/setCookies`);
    return response.data;
}

export async function getAllUsers(): Promise<User[]> {
	const response = await axiosInstance.get<User[]>(`${ENV.VITE_API_URL}/users`);
	return response.data;
}

//todo: fix signature and return type
export async function registerUser(user: User): Promise<User> {
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/register`, user);
    return response.data;
}

export async function loginUser(user: User): Promise<User> {
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/login`, user);
    return response.data;
}