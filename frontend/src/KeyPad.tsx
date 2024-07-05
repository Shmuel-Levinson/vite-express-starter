import React, { useEffect, useState } from "react";
import "./tracker.css";
import checkIcon from "./assets/check.svg";
import backspaceIcon from "./assets/backspace.svg";
import trashIcon from "./assets/trash.svg";
import { formatNumberWithCommas } from "./utils";
import { createExpense, getExpenses, ping } from "./api";
import { User } from "./models/models";

function Keypad ({ user }: { user: User }) {
	const [displayValue, setDisplayValue] = useState("");
	const [padType, setPadType] = useState("digits");
	const padValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];

	const handlePadPress = (padValue: string) => {
		setDisplayValue((prev) => {
			if (prev === "0") {
				if (padValue === "0") {
					return prev;
				} else if (padValue !== ".") {
					return padValue;
				}
			}
			return displayValue + padValue;
		});
	};

	useEffect(() => {
		if (displayValue.length === 0) {
			setPadType("digits");
		}
	}, [displayValue]);

	return (
		<div>
			<button
				onClick={async () => {
					try {
						const res = await ping();
						console.log(res);
					} catch (error) {
						console.log(error);
					}
				}}
			>
				Ping
			</button>
			<div className="keypad-display-wrapper">
				<div className="display" style={{ position: "relative" }}>
					<div
						style={{
							width: "100%",
							marginRight: "auto",
							textAlign: "center",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							gap: "0.1em",
						}}
					>
						{displayValue?.length > 0 && (
							<div style={{ color: "#000", fontSize: "x-large" }}>$ </div>
						)}
						<div
							style={{
								fontFamily: "sans-serif",
								fontSize: displayValue.length === 0 ? "medium" : "x-large",
							}}
						>
							{formatNumberWithCommas(displayValue)}
						</div>
					</div>
					<div
						onClick={() => {
							if (padType === "increment") {
								setDisplayValue("");
							} else {
								setDisplayValue(displayValue.slice(0, -1));
							}
						}}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							cursor: "pointer",
							position: "absolute",
							right: "20px",
							opacity: displayValue.length > 0 ? 1 : 0.1,
							transition: "opacity 0.2s",
						}}
					>
						<img
							width="20px"
							src={padType === "digits" ? backspaceIcon : trashIcon}
							alt=""
						/>
					</div>
				</div>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, auto)",
						gap: "10px",
						padding: "10px",
					}}
				>
					{[50, 100, 150, 200, 250, 300, 500, 1000].map((value) => (
						<button
							className="amount-suggestion"
							onClick={() => {
								setPadType("increment");
								setDisplayValue(value.toString());
							}}
						>
							{formatNumberWithCommas(value.toString())}
						</button>
					))}
				</div>
				<div
					className="multi-pad-container"
					style={{
						height: "200px",
						position: "relative",
						display: "flex",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "repeat(2, auto)",
							gap: "20px",
							padding: "10px",
							position: "absolute",
							width: "100%",
							transform: `perspective(1000px) rotateY(${
								padType === "increment" ? 0 : -180
							}deg)`,
							opacity: padType === "increment" ? 1 : 0.0,
							transition: "all .5s",
							zIndex: padType === "increment" ? 100 : 0,
						}}
					>
						{[5, 10, 20, 50, 100, 200].map((value) => (
							<button
								className="amount-suggestion"
								style={{
									fontSize: "24px",
									pointerEvents: padType === "increment" ? "auto" : "none",
								}}
								onClick={() =>
									setDisplayValue((parseFloat(displayValue) + value).toString())
								}
							>
								+{value}
							</button>
						))}
					</div>
					{(padType === "digits" || true) && (
						<div
							style={{
								position: "absolute",
								width: "100%",
								transform: `perspective(1000px) rotateY(${
									padType === "digits" ? 0 : 180
								}deg)`,
								opacity: padType === "digits" ? 1 : 0.0,
								transition: "all .5s",
								zIndex: padType === "digits" ? 100 : 0,
							}}
							className="keypad"
						>
							{padValues.map((padValue) => {
								let className = `keypad-key`;
								if (padValue === ".") {
									if (displayValue.indexOf(".") !== -1) {
										className = `keypad-key disabled-key`;
									}
								}

								return (
									<button
										key={padValue}
										className={className}
										onClick={() => handlePadPress(padValue)}
										style={
											padType !== "digits" ? { pointerEvents: "none" } : {}
										}
									>
										{padValue}
									</button>
								);
							})}
						</div>
					)}
				</div>

				<button
					onClick={async () => {
						setDisplayValue("");
						setPadType("digits");
						const res = await createExpense({
							amount: parseFloat(displayValue),
							user_id: user.id,
						});
					
					}}
					style={{
						// gridColumn: " 1 / span 3 ",
						marginTop: "10px",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
					className={`keypad-key enter-key ${
						displayValue.length === 0 ? "disabled-key" : ""
					}`}
				>
					<img width="50px" height="50px" src={checkIcon} alt="" />
				</button>
			</div>
		</div>
	);
};

export default Keypad;
