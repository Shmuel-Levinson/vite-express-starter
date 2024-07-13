export type User = {
	id?: number;
	username: string;
	full_name?: string;
	email: string;
	password?: string;
}

export type Auth = {
	salt: string;
	password: string;
	refresh_token?: string;
}