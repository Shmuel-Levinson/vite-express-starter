export function formatNumberWithCommas(numString: string): string {
	if (numString.length === 0) {
		return "";
	}

	const [integer, decimal] = numString.split(".");
	const decimalSeparator = numString.includes(".") ? "." : "";

	return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${decimalSeparator}${
		decimal ?? ""
	}`;
}
