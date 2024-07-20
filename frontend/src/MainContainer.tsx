import {Outlet, useNavigate} from "@tanstack/react-router";
import {useAuth} from "./components/AuthContext.js.tsx";
import {useEffect} from "react";
import {loginUser, logoutUser, setupAxiosInterceptors} from "./api.ts";

export default function MainContainer() {
    const navigate = useNavigate();
    const {loggedInUser, setLoggedInUser} = useAuth();
    useEffect(() => {
        setupAxiosInterceptors(setLoggedInUser);
    })
    useEffect(() => {
        if (loggedInUser) {
            return
        }
        loginUser()
    }, []);
    const themeColor = "#6966c3"
    return (<div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
    }}>
        <header
            style={{height: 50, width: "100%", backgroundColor: themeColor}}>
            <div style={{
                float: "right", border: "1px solid black", height:"100%",display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10
            }}>
                <button onClick={() => {
                    loggedInUser ? logoutUser() : navigate({to: "/login"})
                }}>{`Log ${loggedInUser ? 'out' : 'in'}`}</button>
                {loggedInUser && loggedInUser.username}
                {!loggedInUser && <button onClick={() => {
                    loggedInUser ? logoutUser() : navigate({to: "/join"})
                }}>Join</button>}
            </div>
        </header>
        <div style={{overflowY: "auto", flex: "1"}}>
            <Outlet/>
        </div>
        <footer style={{
            height: 50,
            width: "100%",
            backgroundColor: themeColor
        }}></footer>
    </div>)


}
