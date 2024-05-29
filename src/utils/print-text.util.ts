import chalk from "chalk";

export enum InteractorColor {
	blue = "blue",
	red = "red",
	green = "green",
	yellow = "yellow",
	magenta = "magenta",
	magentaBright = "magentaBright",
}

export const printText = (text: string | unknown, color?: InteractorColor): void => {
	const colorModifier = (() => {
		switch (color) {
			case InteractorColor.green:
				return chalk.green;

			case InteractorColor.red:
				return chalk.red;

			case InteractorColor.blue:
				return chalk.blue;

			case InteractorColor.yellow:
				return chalk.yellow;

			case InteractorColor.magenta:
				return chalk.magenta;

			case InteractorColor.magentaBright:
				return chalk.magentaBright;

			default:
				return chalk.white;
		}
	})();

	if (color) {
		return console.log(colorModifier(text));
	}

	console.log(text);
};
