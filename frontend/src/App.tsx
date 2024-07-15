import {useEffect, useState} from "react";
import {getAllUsers, ping, setCookies} from "./api";
import {User} from "./models/models";
import "./App.css";
import WelcomeScreen from "./WelcomeScreen.tsx";

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    useEffect(() => {
        getAllUsers().then((users) => {
            setUsers(users);
        });
    }, []);

    return (
        <>
            <button
                className="test"
                onClick={async () => {
                    try {
                        const res = await ping();
                        console.log(res);
                    } catch (error) {
                        console.log(error);
                    }
                }}
            >
                Ping
            </button>
            <button
                className="test"
                onClick={async () => {
                    try {
                        const res = await setCookies();
                        console.log(res);
                    } catch (error) {
                        console.log(error);
                    }
                }}
            >
                set cookies
            </button>
            <section>
                <p style={{fontWeight: "bolder", marginBlock: 10}}>log in as:</p>
                <ul style={{display: "flex", flexDirection: "column", gap: 10}}>
                    {users.map((user) => (
                        <li
                            key={user.id}
                            style={{textDecoration: "underline", cursor: "pointer"}}
                            onClick={() => {
                                setLoggedInUser(user);
                            }}
                        >
                            {`${user.username} ${loggedInUser === user ? " (logged in)" : ""}`}
                        </li>
                    ))}
                </ul>
            </section>
            <WelcomeScreen addUser={user => {
                setUsers([...users, user]);
            }}/>
        </>
    );
}

export default App;
