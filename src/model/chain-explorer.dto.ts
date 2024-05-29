import { HexString } from "@natrix-pub/security";

export class SignatureChain {
	actorShareCode!: string;
	id!: HexString; //HexString; kellene már csinálni egy olyan libet amit minden tényleg használhat és csak pár típus lenne, pl ez is.
	ph!: HexString;
	sig!: HexString | null;
	sigs!: SignatureChain[];
}

export class Operation {
	uid!: string;
	signedDataHash!: string;
	signature!: HexString;
	signatureChain!: SignatureChain;
}

export class Block {
	prevHash!: string;
	blockIdx!: number;
	itemCount!: number;
	blockFr!: string;
	blockPK!: string;
	blockAcc!: string;
	chainHash!: string;
	chainPK!: string;
	chainAcc!: string;
	ledgerChainPK!: string;
	timestamp!: number;
	hash!: string;
	sig!: string;
}

export class BlockItemProof {
	blockIdx!: number;
	dataIdx!: number;
	valueHash!: string;
	operation!: Operation | null;
	blockProof!: string;
	chainProof!: string;
    block!: Block;
}
