export default function Notification({message, close}: {
    message: string, close: () => void,
    type?: "success" | "error" | "info" | "warning"
}) {
    return <div style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff66",
    }}>
        <div style={{
            width: "100%", height: "calc(100% - 100px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10

        }}>
            <div style={{
                width: "100%",
                backgroundColor: "white",
                maxWidth: 400,
                height: "100%",
                maxHeight: 500,
                display: "flex",
                // boxShadow: "0px 0px 3px #000000ee",
                borderRadius:"5px",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "1px solid #6865c1",
                gap: 10,
                paddingBottom: 20

            }}>
                <div style={{color:"white",backgroundColor: "#6865c1", width: "100%", textAlign: "center", padding: "10px"}}>
                    <h4>Notification</h4></div>
                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",

                }}>
                    {message}
                </div>
                <div>
                    <button onClick={close}>Thanks</button>
                </div>
            </div>
        </div>
    </div>;
}
