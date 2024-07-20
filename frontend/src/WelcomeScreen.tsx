import {useEffect, useState} from 'react';
import {loginUser, logoutUser, registerUser} from "./api.ts";
import {useAuth} from "./components/AuthContext.js.tsx";
// import {generateRandomUser} from "./debug-utils.ts";


interface WelcomeScreenProps {
    formType?: 'login' | 'register'
}

export default function WelcomeScreen({formType = 'register'}: WelcomeScreenProps) {
    // const randomUser: { username: string, email: string, password: string } = generateRandomUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {loggedInUser,setLoggedInUser} = useAuth();
    useEffect(() => {
        loginUser().then(() => {

        });
    }, []);
    const handleRegister = async () => {
        try {
            console.log('Register:', username, email, password);
            const res = await registerUser({email: email, password: password, username: username});
            console.log(res);
            // setLoggedIn(true);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }
    const handleLogin = async () => {
        try {
            console.log('Login:', email, password);
            const user = await loginUser({email: email, password: password, username: username});
            console.log(user);
            // setLoggedIn(true);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }
    const handleLogout = async () => {
        try {
            console.log('Logout:', email, password);
            const user = await logoutUser();
            console.log(user);
            setLoggedInUser(null)
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }
    const handleSilentLogin = async () => {
        try {
            console.log('Silent Login:', email, password);
            const user = await loginUser();
            // setLoggedIn(true);
            console.log(user);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        }}>
            <h1>Welcome to the React App!</h1>
            <h2>{loggedInUser?.username}</h2>
            <h2 style={{backgroundColor: loggedInUser ? "#99eeee" : "#ee9999"}}>
                {`You are ${loggedInUser ? "logged in" : "not logged in"}`}</h2>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />
                {formType === 'register' && <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />
            </div>
            <div>
                <button onClick={handleRegister}>Register</button>
                <button onClick={handleLogin}>Log In</button>
                <button onClick={handleSilentLogin}>Silent Log In</button>
                <button onClick={handleLogout}>Log Out</button>
            </div>


        </div>
    );
}
