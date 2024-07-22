import {useState} from "react";

type NotificationModalProps = {
    message: string
    title: string
    type?: string
    close: () => void
}

export default function NotificationModal({message, title, close}: NotificationModalProps) {
    const [cn, setCn] = useState("notification-modal-appear")
    const delayedClose = () => {
        setCn("notification-modal-disappear")
        setTimeout(() => {
            close()
        }, 300)
    }
    return (
        <div onClick={delayedClose} style={{
            position: "absolute", width: "100%",
            height: "100%",
            top: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",

        }}>
            <div
                className={cn}
                style={{
                    border: `1px solid #6865c1`,
                    backgroundColor: "white",
                    borderRadius: "4px",
                    height: "calc(100% - 100px)",
                    maxHeight: "600px",
                    width: "100%",
                    maxWidth: "400px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <div style={{backgroundColor: "#6865c1", width: "100%", color: "white"}}><h4
                    style={{textAlign: "center"}}>{title}</h4></div>
                <div style={{textAlign: "center", flex: 1, padding: 20}}>{message}</div>
                <button style={{width: "min-content", marginBlock: 10}} onClick={delayedClose}>Dismiss
                </button>
            </div>
        </div>
    )
}