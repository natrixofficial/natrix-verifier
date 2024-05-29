import { prompt } from "prompts";
import { verifyValueHashAction } from "../actions/verifier.actions";
import { state } from "../state/state";
import { valueHashValidator } from "../utils/validators";
import { printText } from "../utils/print-text.util";
import { BlockItemProof } from "../model/chain-explorer.dto";

export const verificationPrompt = async (): Promise<boolean> => {
	const { valueHash } = await prompt(
		{
			name: "valueHash",
			type: "text",
			message: "Enter a valid value hash:",
			validate: (valueHash: string) => valueHashValidator(valueHash),
		},
		{
			onCancel: () => {
				printText("Exit Natrix Verifier");
				process.exit(1);
			},
		},
	);

	if (!valueHash) {
		throw new Error("Invalid value hash");
	}

	state.valueHash = valueHash;

	return verifyValueHashAction();
};

export const selectBlockItemProofPrompt = async (blockItemProofs: BlockItemProof[]): Promise<BlockItemProof> => {
	const { blockItemProof } = await prompt({
		name: "blockItemProof",
		type: "select",
		message: "Select a block item proof:",
		choices: blockItemProofs.map((blockItemProof: BlockItemProof) => ({
			title: `Signature: ${blockItemProof.operation?.signature}, BlockChainPK: ${blockItemProof.block.ledgerChainPK}, BlockIdx: ${blockItemProof.blockIdx}, DataIdx: ${blockItemProof.dataIdx}`,
			value: blockItemProof,
		})),
	});
	return blockItemProof;
};
