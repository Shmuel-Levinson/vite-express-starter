export type User = {
	id: number;
	full_name: string;
	email: string;
}

export type Expense = {
	id?: string;
	amount: number;
	description?: string;
	category?: string;
	date?: Date;
	user_id: number;
}

export type Category = {
    name: string;
}
//  this is a test