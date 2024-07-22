import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
import {AuthProvider} from "./components/AuthContext.js.tsx";
import {RouterProvider} from "@tanstack/react-router";
import router from "./router.tsx";
import {NotificationProvider} from "./components/NotificationContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <NotificationProvider>
            <RouterProvider router={router}/>
        </NotificationProvider>
    </AuthProvider>
)