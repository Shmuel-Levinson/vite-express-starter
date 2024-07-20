import {ping, setCookies, setupAxiosInterceptors} from "./api";
import "./App.css";
import WelcomeScreen from "./WelcomeScreen.tsx";
import {useEffect} from "react";
import {useAuth} from "./components/AuthContext.js.tsx";

function App() {

    const {setLoggedInUser} = useAuth();

    useEffect(()=>{
        setupAxiosInterceptors(setLoggedInUser);
    })
    return (
        <>
            {/*<button*/}
            {/*    className="test"*/}
            {/*    onClick={async () => {*/}
            {/*        try {*/}
            {/*            const res = await ping();*/}
            {/*            console.log(res);*/}
            {/*        } catch (error) {*/}
            {/*            console.log(error);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Ping*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    className="test"*/}
            {/*    onClick={async () => {*/}
            {/*        try {*/}
            {/*            const res = await setCookies();*/}
            {/*            console.log(res);*/}
            {/*        } catch (error) {*/}
            {/*            console.log(error);*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            {/*    set cookies*/}
            {/*</button>*/}

            <WelcomeScreen/>
        </>
    );
}

export default App;
