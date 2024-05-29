interface AppState {
	valueHash: string;

	ledgerChainPK: string;

	trxBlockIdx: number;
	actBlockIdx: number;

	trxBlockProof: string;
	trxChainProof: string;
	trxBlockPK: string;
	trxBlockAcc: string;
	trxChainHash: string;
	trxChainPK: string;
	trxChainAcc: string;

	actChainHash: string;
	actChainPK: string;
	actChainAcc: string;

	firstChainPK: string;

	deltaChainPk: string;
	deltaNextChainPK: string;

	ledgerChainInitSig: string;
}

const INITIAL_STATE: AppState = {
	valueHash: "",

	ledgerChainPK: "",

	trxBlockIdx: 0,
	actBlockIdx: 0,

	trxBlockProof: "",
	trxChainProof: "",
	trxBlockPK: "",
	trxBlockAcc: "",
	trxChainHash: "",
	trxChainPK: "",
	trxChainAcc: "",

	actChainHash: "",
	actChainPK: "",
	actChainAcc: "",

	deltaChainPk: "",
	deltaNextChainPK: "",

	firstChainPK: "",
	ledgerChainInitSig: "",
};

export const state: AppState = INITIAL_STATE;
