export default function Spinner() {
    return <div
        className="spinner-rotation"
        style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `conic-gradient(${"#44444400"},${"#444444ff"} )`,
            mask: "radial-gradient(farthest-side, transparent calc(100% - 5px), black calc(100% - 4px))",
        }}/>;
}
