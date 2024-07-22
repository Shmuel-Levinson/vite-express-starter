import {useState} from "react";

type NotificationModalProps = {
    message: string
    title: string
    type?: string
    close: () => void
}

export default function NotificationModal({message,title,type,close}:NotificationModalProps){
    const [cn, setCn] = useState("notification-modal-appear")
    const delayedClose = () => {
        setCn("notification-modal-disappear")
        setTimeout(() => {
            close()
        }, 300)
    }
    return (
        <div onClick={delayedClose} style={{position: "absolute", width:"100%",
            height: "100%",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div
                className={cn}
                style={{
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
                <button style={{width: "min-content"}} onClick={delayedClose}>Dismiss
                </button>
            </div>
        </div>
    )
}