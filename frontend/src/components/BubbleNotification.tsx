type BubbleNotificationProps = {
    message: string
    type?: NotificationType
    close: () => void
}
type NotificationType = "info" | "success" | "error" | "warning" | "default"
const BUBBLE_COLOR_MAP: { [key in NotificationType]: { color: string, backgroundColor: string } } = {
    info: {color: "#ffffff", backgroundColor: "#6666ff"},
    success: {color: "#ffffff", backgroundColor: "#66cc66"},
    error: {color: "#ffffff", backgroundColor: "#ff6666"},
    warning: {color: "#000000", backgroundColor: "#ffff66"},
    default: {color: "#ffffff", backgroundColor: "#999999"},}
export default function BubbleNotification({message, type="info", close}: BubbleNotificationProps) {

    const colorPallet = BUBBLE_COLOR_MAP[type || "default"]
    return <div style={{
        width: "100%", position: "absolute",
        top: 60
    }}>
        <div className="notification-modal-appear"
             style={{...{
                 padding: "10px",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 borderRadius: "10px",
                 marginInline:"6px"
             }, ...colorPallet}}>
            <div style={{verticalAlign: "middle", marginRight: "auto"}}>{message}</div>
            <button onClick={close}>Dismiss</button>
        </div>
    </div>;
}
