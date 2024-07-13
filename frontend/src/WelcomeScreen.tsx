import {useState} from 'react';
import {registerUser} from "./api.ts";
import {generateRandomUser} from "./debug-utils.ts";


export default function WelcomeScreen() {
    const randomUser: { username: string, email: string, password: string } = generateRandomUser();
    const [name, setName] = useState(randomUser.username);
    const [email, setEmail] = useState( randomUser.email);
    const [password, setPassword] = useState(       randomUser.password);

    const handleRegister = () => {
        console.log('Register:', name, email, password);
        registerUser({email: email, password: password, username: name}).then((user) => {
            console.log(user);
        });
    }

    const handleLogin = () => {
        console.log('Login:', email, password);
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
            <h1>Welcome to the React App!</h1>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />
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
