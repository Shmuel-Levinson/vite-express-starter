import {useEffect, useState} from "react";

export default function Spinner() {
    const [show, setShow] = useState(false);
    const [tintColor, setTintColor] = useState("#00000000");
    setTimeout(() => {
        setShow(true)
        setTintColor("#00000040")
    }, 250);
    return (
        show &&
        <div style={{backgroundColor: tintColor,
            width:"100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            transition: "all 0.5s ease-in-out",
        }}>
            <div
                className="spinner-rotation"
                style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: `conic-gradient(#44444400,#444444ff)`,
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 4px))",
                }}/>
        </div>
    )
}
