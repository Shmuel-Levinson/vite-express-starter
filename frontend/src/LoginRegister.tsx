import {useState} from 'react';
import {loginUser, logoutUser, registerUser} from "./api.ts";
import {useAuth} from "./components/AuthContext.js.tsx";
import {useNavigate} from "@tanstack/react-router";

// import {generateRandomUser} from "./debug-utils.ts";


interface WelcomeScreenProps {
    formType?: 'login' | 'join'
}

export default function LoginRegister({formType = 'join'}: WelcomeScreenProps) {
    // const randomUser: { username: string, email: string, password: string } = generateRandomUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {loggedInUser, setLoggedInUser} = useAuth();
    const navigate = useNavigate();

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
        } catch (error) {
            console.error('Error logging in:', error);
        } finally {
            setLoggedInUser(null) //instant logout regardless of server response
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
            {/*<h2 style={{backgroundColor: loggedInUser ? "#99eeee" : "#ee9999"}}>*/}
            {/*    {`You are ${loggedInUser ? "logged in" : "not logged in"}`}</h2>*/}
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    style={{marginBottom: '10px'}}
                />
                {/*{formType === 'register' && <input*/}
                {/*    type="email"*/}
                {/*    placeholder="Email"*/}
                {/*    value={email}*/}
                {/*    onChange={(e) => {*/}
                {/*        setEmail(e.target.value)*/}
                {/*    }}*/}
                {/*    style={{marginBottom: '10px'}}*/}
                {/*/>}*/}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    style={{marginBottom: '10px', padding: '5px'}}
                />
            </div>
            {formType === 'login' && <>
                <button onClick={handleLogin}>Login</button>
                <div>Not a member yet?
                    <span onClick={() => navigate({to: '/join'})}
                          style={{textDecoration: "underline", cursor: "pointer"}}>
                         Join
                    </span>
                </div>
            </>}
            {formType === 'join' && <>
                <button onClick={handleRegister}>Join</button>
                <div>Already a member?
                    <span onClick={() => navigate({to: '/login'})}
                          style={{marginLeft:2, textDecoration: "underline", cursor: "pointer"}}>
                         Log in
                    </span>
                </div>
            </>}



        </div>
    );
}
