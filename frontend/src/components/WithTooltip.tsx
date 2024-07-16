import {useState} from "react";

export function WithTooltip(props: { children: React.ReactNode, tooltip: string }) {
    const [showTooltip, setShowTooltip] = useState(false);
    return (
        <div
            style={{
                display: "inline-block",
                position: "relative",
                cursor: "pointer",
            }}
            className="tooltip"
        >
            <div onMouseEnter={() => setShowTooltip(true)}
                 onMouseLeave={() => setShowTooltip(false)}>{props.children}</div>
            {showTooltip && <div style={{position: "absolute", bottom: -80}}>{props.tooltip}</div>}
        </div>
    )
}