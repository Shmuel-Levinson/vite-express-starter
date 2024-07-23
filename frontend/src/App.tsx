import "./App.css";
import {useAuth} from "./components/AuthContext.js.tsx";
import {ping} from "./api.ts";
import {useNotification} from "./components/NotificationContext.tsx";


function App() {
    const {loggedInUser} = useAuth();
    const {setBubbleNotification} = useNotification();
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>
                <div>
                    {`This is the home page ${ loggedInUser? "of " + loggedInUser?.username : ""}`}
                </div>
                <button style={{width:"fit-content"}} onClick={()=>{ping()}}>Ping</button>
                <button style={{width:"fit-content"}} onClick={()=>setBubbleNotification({
                    message: "Bubble!",
                    title: ""
                })}>Show bubble!!</button>
            </div>
            {/*<LoginRegister/>*/}
        </>
    );
}

export default App;
