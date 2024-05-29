
import { InteractorColor, printText } from "../utils/print-text.util";
import { httpClient } from "../utils/axios-instance.util";
import { environment } from "../environment/environment";
import { state } from "../state/state";
import chalk from "chalk";
import { selectBlockItemProofPrompt } from "../prompts/verifier.prompt";
import { Hiver, Proofer } from "@natrix-pub/security";
import { Block, BlockItemProof } from "../model/chain-explorer.dto";

export const verifyValueHashAction = async (): Promise<boolean> => {
	printText(chalk.bold("Fetch verification data"));

	const trxBlockItemProof = await fetchTrxBlockItemProofsAction();

	if (!trxBlockItemProof) {
		throw new Error("Block Item Proof not found for value hash");
	}

	state.ledgerChainPK = trxBlockItemProof.block.ledgerChainPK;
	state.trxBlockIdx = trxBlockItemProof.blockIdx;
	state.trxBlockProof = trxBlockItemProof.blockProof;
	state.trxChainProof = trxBlockItemProof.chainProof;
	state.trxBlockPK = trxBlockItemProof.block.blockPK;
	state.trxBlockAcc = trxBlockItemProof.block.blockAcc;
	state.trxChainHash = trxBlockItemProof.block.chainHash;
	state.trxChainPK = trxBlockItemProof.block.chainPK;
	state.trxChainAcc = trxBlockItemProof.block.chainAcc;

	const actBlock = await getActBlockAction();

	state.actBlockIdx = actBlock.blockIdx;
	state.actChainHash = actBlock.chainHash;
	state.actChainPK = actBlock.chainPK;
	state.actChainAcc = actBlock.chainAcc;

	const deltaBlockIdx = state.actBlockIdx - state.trxBlockIdx;

	const deltaBlock = await getBlockByBlockIdx(deltaBlockIdx);

	state.deltaChainPk = deltaBlock.chainPK;

	const deltaNextBlock = await getBlockByBlockIdx(deltaBlockIdx + 1);

	state.deltaNextChainPK = deltaNextBlock.chainPK;

	const firstBlock = await getBlockByBlockIdx(1);

	state.firstChainPK = firstBlock.chainPK;

	const genesisBlock = await getBlockByBlockIdx(0);

	state.ledgerChainInitSig = genesisBlock.chainAcc;

	printText(state);

	return await verifyTrx();
};

const fetchTrxBlockItemProofsAction = async (): Promise<BlockItemProof | null> => {
	const response = await httpClient.get<BlockItemProof[]>(`${environment.api.baseURL}/block-item-proof`, {
		params: { valueHash: state.valueHash },
	});

	if (response.data.length === 0) {
		return null;
	}

	if (response.data.length > 1) {
		printText(chalk.bold("More than 1 block item proofs found!"), InteractorColor.yellow);
		return await selectBlockItemProofPrompt(response.data);
	}

	return response.data[0];
};

const getActBlockAction = async (): Promise<Block> => {
	const response = await httpClient.get<Block[]>(`${environment.api.baseURL}/blocks`, {
		params: { ledgerChainPK: state.ledgerChainPK, docCount: 1, offset: 0 },
	});

	return response.data[0];
};

const getBlockByBlockIdx = async (blockIdx: number): Promise<Block> => {
	const response = await httpClient.get<Block>(`${environment.api.baseURL}/block`, {
		params: { ledgerChainPK: state.ledgerChainPK, blockIdx },
	});

	return response.data;
};

const verifyTrx = async (): Promise<boolean> => {
	return Proofer.checkTrx(
		state.valueHash,

		Hiver.toSignature(state.trxBlockProof),
		Hiver.toSignature(state.trxChainProof),

		Hiver.toPublicKey(state.trxBlockPK),
		Hiver.toSignature(state.trxBlockAcc),
		Hiver.toFr(state.trxChainHash),
		Hiver.toPublicKey(state.trxChainPK),
		Hiver.toSignature(state.trxChainAcc),

		Hiver.toFr(state.actChainHash),
		Hiver.toPublicKey(state.actChainPK),
		Hiver.toSignature(state.actChainAcc),

		Hiver.toPublicKey(state.firstChainPK),
		Hiver.toPublicKey(state.deltaChainPk),
		Hiver.toPublicKey(state.deltaNextChainPK),

		Hiver.toSignature(state.ledgerChainInitSig),
		"26d36cccc8ef6aca3a8ff08782c2cfbb71efbdedea58840fcc8d7223f3e43d2d5f1603a54438c887e92ccd0ef4dbb24d6e13a0acf28774d0884b4cfba19fcc46",
	);
};
