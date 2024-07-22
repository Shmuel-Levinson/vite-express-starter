import {useEffect, useState} from 'react';
import {checkUsername, loginUser, logoutUser, registerUser} from "./api.ts";

import {useNavigate} from "@tanstack/react-router";
import useDebounce from "./useDebounce.ts";

import {generateRandomUser} from "./debug-utils.ts";
import {useNotification} from "./components/NotificationContext.tsx";


interface WelcomeScreenProps {
    formType?: 'login' | 'join'
}

export default function LoginRegister({formType = 'join'}: WelcomeScreenProps) {
    const randomUser: { username: string, email: string, password: string } = generateRandomUser();
    const [username, setUsername] = useDebounce((u) => {
        if (u && formType === 'join') {
            setUserNameAvailable("checking...");
            checkUsername(u).then(res => {
                console.log("!!!", res)
                if (res?.status === 200) {
                    console.log(res.data);
                    console.log(res.data.available);
                    if (res.data.available) {
                        setUserNameAvailable("available");
                    } else {
                        setUserNameAvailable("not available");
                    }
                }
            });
        }
    }, 500, {
        disableCallback: formType !== 'join',
        initialValue: "",
        onChange: () => {
            setUserNameAvailable("")
        }
    });

    const [userNameAvailable, setUserNameAvailable] = useState<"available" | "not available" | "" | "checking...">("");
    const [email, setEmail] = useState(randomUser.email);
    const [password, setPassword] = useState("");
    // const {loggedInUser, setLoggedInUser} = useAuth();
    const navigate = useNavigate();
    const {setNotification} = useNotification();
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
    // useEffect(() => {
    //     if (username === "") {
    //         setUserNameAvailable("")
    //     }
    // }, [username])
    const handleLogin = async () => {
        try {
            console.log('Login:', email, password);
            const res = await loginUser({email: email, password: password, username: username});
            setNotification({message: `Welcome ${res.user.username}`, type: "success"})
            console.log(res);

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
            <form autoComplete="on" onSubmit={async (e) => {
                e.preventDefault()
                if (formType === 'join') {
                    await handleRegister()
                } else {
                    await handleLogin()
                }

                await navigate({to: '/', replace: true})
            }} style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>

                    <input
                        type="text"
                        placeholder="Username or Email"
                        name="username"
                        value={username}
                        autoComplete="usename"
                        onChange={(e) => {
                            setUsername(e.target.value)
                        }}
                        style={{marginBottom: '10px'}}
                    />
                    <div>{userNameAvailable}</div>
                    <input
                        type="password"
                        autoComplete="current-password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        style={{marginBottom: '10px', padding: '5px'}}
                    />

                </div>
                {formType === 'login' && <>
                    <button type="submit">Login</button>
                    <div>Not a member yet?
                        <span onClick={() => navigate({to: '/join'})}
                              style={{textDecoration: "underline", cursor: "pointer"}}>
                         Join
                    </span>
                    </div>
                </>}
                {formType === 'join' && <>
                    <button style={{
                        pointerEvents: userNameAvailable !== "available" ? "none" : "auto",
                        opacity: userNameAvailable !== "available" ? 0.5 : 1
                    }}
                            type="submit">Join
                    </button>
                    <div>Already a member?
                        <span onClick={() => navigate({to: '/login'})}
                              style={{marginLeft: 2, textDecoration: "underline", cursor: "pointer"}}>
                         Log in
                    </span>
                    </div>
                </>}
            </form>


        </div>
    );
}
