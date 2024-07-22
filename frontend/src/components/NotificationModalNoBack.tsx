import {useState} from "react";

type NotificationModalProps = {
    message: string
    title: string
    type?: string
    close: () => void
}

export default function NotificationModalNoBack({message,title,type,close}:NotificationModalProps){
    const [cn, setCn] = useState("notification-modal-appear")
    return (
        <div
            className={cn}
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                border: `1px solid #6865c1`,
                backgroundColor: "white",
                borderRadius: "4px",
                height: "calc(100% - 150px)",
                maxHeight: "600px",
                width: "calc(100% - 50px)",
                maxWidth: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <div>{message}</div>
            <button style={{width:"min-content"}} onClick={()=>{
                setCn("notification-modal-disappear")
                setTimeout(() => {
                    close()
                }, 1000)
            }}>Dismiss</button>
        </div>
    )
}