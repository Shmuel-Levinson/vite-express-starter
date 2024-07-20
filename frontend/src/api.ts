import {User} from "./models/models";
import axios from "axios";
import {ENV} from "./env";


let setLoggedInUser: (user: User | null) => void

export function setupAxiosInterceptors(setLoggedInFunction: (user: User | null) => void) {
    setLoggedInUser = setLoggedInFunction;
}

export const axiosInstance = axios.create({
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    res => {
        const user = res.data.user;
        if (res.data.logged_in === true && user) {
            setLoggedInUser && setLoggedInUser(user);
        }
        if (res.data.logged_in === false) {
            setLoggedInUser && setLoggedInUser(null);
        }
        return res;
    },
    error => {
        return Promise.reject(error);
    }
);

export async function ping(): Promise<object> {
    const response = await axiosInstance.get(`${ENV.VITE_API_URL}/ping`);
    return response.data;
}

export async function setCookies(): Promise<object> {
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

export async function loginUser(user?: User): Promise<User> {
    //if user is not provided, we assume that the user is already logged in and rely on the cookies
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/login`, user);
    return response.data;
}

export async function logoutUser(): Promise<User> {
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/logout`);
    return response.data;
}