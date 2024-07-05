import { useEffect, useState } from "react";
import KeyPad from "./KeyPad";
import { getAllUsers, getExpenses } from "./api";
import { Expense, User } from "./models/models";

function App() {
	const [users, setUsers] = useState<User[]>([]);
	const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
	useEffect(() => {
		getAllUsers().then((users) => {
			console.log(users);
			setUsers(users as User[]);
		});
	}, []);

  useEffect(() => {
    //fetch expenses by user
    if(!loggedInUser){
      return;
    }
    getExpenses(loggedInUser.id).then((expenses) => {
      console.log(expenses);
      setExpenses(expenses as Expense[]);
    });
  },[loggedInUser])

	return (
		<div>
			{loggedInUser && <KeyPad user={loggedInUser} />}
			<div>
        <div style={{fontWeight:"bolder"}}>log in as:</div>
				{users.map((user) => (
					<div
						style={{ textDecoration: "underline", cursor: "pointer" }}
						onClick={() => {
							setLoggedInUser(user);

						}}
					>
						{`${user.full_name} ${loggedInUser === user ? " (logged in)" : ""}`}
					</div>
				))}
			</div>
      {expenses.map((expense) => (
        <div>
          {expense.amount}
        </div>
      ))}
		</div>
	);
}

export default App;
