export enum BridgeMessageType {
	REQUEST_CLIENT_SECRET = "REQUEST_CLIENT_SECRET",
	RESPONSE_CLIENT_SECRET = "RESPONSE_CLIENT_SECRET",
	ERROR = "ERROR",
}

export type BridgeMessage = {
	id: string;
	type: BridgeMessageType;
	payload?: unknown;
};

export type RequestClientSecretMessage = {
	id: string;
	type: BridgeMessageType.REQUEST_CLIENT_SECRET;
};

export type ResponseClientSecretMessage = {
	id: string;
	type: BridgeMessageType.RESPONSE_CLIENT_SECRET;
	payload: {
		clientSecret: string;
	};
};

export type ErrorMessage = {
	id: string;
	type: BridgeMessageType.ERROR;
	payload: {
		error: string;
	};
};

export type BridgeMessageUnion =
	| RequestClientSecretMessage
	| ResponseClientSecretMessage
	| ErrorMessage;

export function isBridgeMessage(
	message: unknown,
): message is BridgeMessageUnion {
	return (
		typeof message === "object" &&
		message !== null &&
		"id" in message &&
		"type" in message &&
		typeof (message as BridgeMessage).id === "string" &&
		Object.values(BridgeMessageType).includes((message as BridgeMessage).type)
	);
}
