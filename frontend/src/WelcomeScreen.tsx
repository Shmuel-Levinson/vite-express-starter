import {useState} from 'react';
import {loginUser, registerUser} from "./api.ts";
// import {generateRandomUser} from "./debug-utils.ts";
import {User} from "./models/models.ts";


interface WelcomeScreenProps {
    addUser?: (user: User) => void
    formType?: 'login' | 'register'
}

export default function WelcomeScreen({addUser, formType = 'register'}: WelcomeScreenProps) {
    // const randomUser: { username: string, email: string, password: string } = generateRandomUser();
    const [username, setUsername] = useState("a");
    const [email, setEmail] = useState("a");
    const [password, setPassword] = useState("a");

    const handleRegister = async () => {
        try {
            console.log('Register:', username, email, password);
            const res = await registerUser({email: email, password: password, username: username});
            console.log(res);
            addUser && addUser(res);
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    const handleLogin = async () => {
        try {
            console.log('Login:', email, password);
            const user = await loginUser({email: email, password: password, username: username});
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
            </div>
        </div>
    );
}
