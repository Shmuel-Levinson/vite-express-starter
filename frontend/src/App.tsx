import "./App.css";
import {useAuth} from "./components/AuthContext.js.tsx";
import {ping} from "./api.ts";


function App() {
    const {loggedInUser} = useAuth();
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
                <button style={{width:"min-content"}} onClick={()=>{ping()}}>Ping</button>
            </div>
            {/*<LoginRegister/>*/}
        </>
    );
}

export default App;
