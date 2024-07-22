import {Outlet, useNavigate} from "@tanstack/react-router";
import {useAuth} from "./components/AuthContext.js.tsx";
import {useEffect} from "react";
import {loginUser, logoutUser, setupAxiosInterceptors} from "./api.ts";
import {useNotification} from "./components/NotificationContext.tsx";
import Notification from "./components/Notification.tsx";
import Spinner from "./components/Spinner.tsx";
import NotificationModal from "./components/NotificationModal.tsx";


export default function MainContainer() {
    const navigate = useNavigate();
    const {loggedInUser, setLoggedInUser} = useAuth();
    const {setNotification, notification, setShowSpinner, showSpinner} = useNotification();

    useEffect(() => {
        setupAxiosInterceptors(setLoggedInUser, setShowSpinner);
    })
    useEffect(() => {
        if (loggedInUser) {
            return
        }
        loginUser().then((res) => {
            setNotification({
                message: `Welcome back ${res.user.username}`,
                type: "success",
                title: "Login successful"
            })
        })
    }, []);
    const themeColor = "#6966c3"
    return (<>
        <div style={
            {
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                textAlign: "center",
            }}>
            {showSpinner && <Spinner/>}
        </div>

        <div style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
        }}>
            <header style={{height: 50, width: "100%", backgroundColor: themeColor}}>
                <div style={{
                    float: "right", height: "100%", display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10
                }}>
                    <div>
                        <button onClick={() => navigate({to: "/about"})}>
                            About
                        </button>
                    </div>

                    <div>
                        <button onClick={() => navigate({to: "/", replace: true})}>
                            Home
                        </button>
                    </div>

                    <button onClick={() => {
                        loggedInUser ? logoutUser() : navigate({to: "/login"})
                    }}>{`Log ${loggedInUser ? 'out' : 'in'}`}
                    </button>

                    <div style={{color: "white", fontSize: 20}}>
                        {loggedInUser && loggedInUser.username}
                    </div>

                    {!loggedInUser && <button onClick={() => {
                        navigate({to: "/join"})
                    }}>
                        Join
                    </button>
                    }
                </div>
            </header>

            <div style={{overflowY: "auto", flex: "1"}}>
                {notification && <NotificationModal message={notification?.message} close={() => setNotification(null)} title={notification.title}/>}
                <Outlet/>
            </div>

            <footer style={{
                height: 50,
                width: "100%",
                backgroundColor: themeColor
            }}></footer>
        </div>
    </>)


}
