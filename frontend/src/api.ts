import {User} from "./models/models";
import axios, {AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {ENV} from "./env";


let setLoggedInUser: (user: User | null) => void
let setShowSpinner: (t: boolean) => void

type RequestInterceptorSuccess = (config: InternalAxiosRequestConfig) => void
type ResponseInterceptorSuccess = (response?: AxiosResponse) => void
type InterceptorFailure = (error?: never) => void
type RequestInterceptorPair = {
    onSuccess: RequestInterceptorSuccess,
    onFailure: InterceptorFailure
}
type ResponseInterceptorPair = {
    onSuccess: ResponseInterceptorSuccess,
    onFailure: InterceptorFailure
}
type ArrayOfRequestInterceptorPairs = RequestInterceptorPair[]
type ArrayOfResponseInterceptorPairs = ResponseInterceptorPair[]

export function addAxiosInterceptors(interceptorPairs: {
    onRequest: ArrayOfRequestInterceptorPairs,
    onResponse: ArrayOfResponseInterceptorPairs
}) {
    axiosInstance.interceptors.request.use((config) => {
        for (const requestInterceptorPair of interceptorPairs.onRequest) {
            requestInterceptorPair.onSuccess(config);
        }
        return config;
    }, (error) => {
        for (const requestInterceptorPair of interceptorPairs.onRequest) {
            requestInterceptorPair.onFailure(error);
        }
    });
    axiosInstance.interceptors.response.use((response) => {
        for (const responseInterceptorPair of interceptorPairs.onResponse) {
                responseInterceptorPair.onSuccess(response);
            }
        return response;
    },
    (error) => {
        for (const responseInterceptorPair of interceptorPairs.onResponse) {
                responseInterceptorPair.onSuccess(error);
        }
    });
}

export const axiosInstance = axios.create({
    withCredentials: true,
})


axiosInstance.interceptors.request.use(
    config => {
        console.log("request!!", config);
        setShowSpinner && setShowSpinner(true);
        return config;
    },
    error => {
        setShowSpinner && setShowSpinner(false);
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    res => {
        setShowSpinner && setShowSpinner(false);
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
        setShowSpinner && setShowSpinner(false);
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

export async function loginUser(user?: User): Promise<{ user: User }> {
    //if user is not provided, we assume that the user is already logged in and rely on the cookies
    const response = await axiosInstance.post<{ user: User }>(`${ENV.VITE_API_URL}/login`, user);
    return response.data;
}

export async function logoutUser(): Promise<User> {
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/logout`);
    return response.data;
}

export async function checkUsername(username: string): Promise<object> {
    const response = await axiosInstance.post<User>(`${ENV.VITE_API_URL}/checkUsername`, {username});
    return response;
}