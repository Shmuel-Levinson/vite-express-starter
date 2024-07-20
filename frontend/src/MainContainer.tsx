import {Outlet} from "@tanstack/react-router";
import {useAuth} from "./components/AuthContext.js.tsx";

export default function MainContainer(){
    const {loggedInUser,setLoggedInUser} = useAuth();
    return (<div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        overflow: "hidden"
    }}>
        <header
            style={{height: 100, width: "100%", backgroundColor: "#6b43aa"}}>
            {loggedInUser && loggedInUser.username}
        </header>
        <div style={{overflowY: "auto", flex: "1"}}>
            <Outlet/>
        </div>
        <footer style={{
            height: 100,
            width: "100%",
            backgroundColor: "#6b43aa"
        }}></footer>
    </div>)


}
