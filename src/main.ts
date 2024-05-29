import chalk from "chalk";
import { InteractorColor, printText } from "./utils/print-text.util";
import { environment } from "./environment/environment";
import { verificationPrompt } from "./prompts/verifier.prompt";
import { Hiver } from "@natrix-pub/security";
import { config } from "dotenv";

async function initDependencies(): Promise<void> {
	config({debug: true});
	await Hiver.init();
}

async function start(): Promise<void> {
	await initDependencies();

	printText(chalk.bold("-----------------------------------"), InteractorColor.green);
	printText(chalk.bold("--- Welcome to Natrix verifier! ---"), InteractorColor.green);
	printText(chalk.bold("-----------------------------------"), InteractorColor.green);

	printText("");
	printText(chalk.bold("Please check if you are connected to the correct environment!"));
	// console.log(process.env["BASE_URL"]);
	printText(`${chalk.bold("Chain explorer API:")} ${chalk.redBright(environment.api.baseURL)}`);
	printText("");

	do {
		try {
			const verification = await verificationPrompt();

			printText("");
			printText(chalk.bold(`Verification result: ${verification}`), verification ? InteractorColor.blue : InteractorColor.red);
		} catch (err) {
			handleError(err);
		}
		// eslint-disable-next-line no-constant-condition
	} while (true);
}

function handleError(err: unknown): void {
	const error = err as Error;
	printText(`${error.name}: ${error.message}`, InteractorColor.red);
}

start()
	.catch((e) => {
		const error = e as Error;
		printText(error.message, InteractorColor.red);
		//throw e;
	})
	.finally(() => process.exit(0));
