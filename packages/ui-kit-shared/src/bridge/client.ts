import {
	BridgeMessageType,
	type BridgeMessageUnion,
	type ErrorMessage,
	isBridgeMessage,
	type RequestClientSecretMessage,
	type ResponseClientSecretMessage,
} from ".";

type PendingRequest = {
	resolve: (value: string) => void;
	reject: (error: Error) => void;
};

export class BridgeClient {
	private pendingRequests: Map<string, PendingRequest> = new Map();
	private messageListener: ((event: MessageEvent) => void) | null = null;

	constructor() {
		this.setupMessageListener();
	}

	private setupMessageListener(): void {
		this.messageListener = this.handleMessage.bind(this);
		window.addEventListener("message", this.messageListener);
	}

	private handleMessage(event: MessageEvent): void {
		if (event.source !== window.parent) {
			return;
		}

		const message = event.data;

		if (!isBridgeMessage(message)) {
			return;
		}

		this.processMessage(message);
	}

	private processMessage(message: BridgeMessageUnion): void {
		const pending = this.pendingRequests.get(message.id);

		if (!pending) {
			return;
		}

		this.pendingRequests.delete(message.id);

		switch (message.type) {
			case BridgeMessageType.RESPONSE_CLIENT_SECRET:
				{
					const response = message as ResponseClientSecretMessage;
					pending.resolve(response.payload.clientSecret);
				}
				break;

			case BridgeMessageType.ERROR:
				{
					const error = message as ErrorMessage;
					pending.reject(new Error(error.payload.error));
				}
				break;
		}
	}

	public async getClientSecret(): Promise<string> {
		return new Promise((resolve, reject) => {
			const id = crypto.randomUUID();

			this.pendingRequests.set(id, { resolve, reject });

			const request: RequestClientSecretMessage = {
				id,
				type: BridgeMessageType.REQUEST_CLIENT_SECRET,
			};

			window.parent.postMessage(request, "*");

			setTimeout(() => {
				if (this.pendingRequests.has(id)) {
					this.pendingRequests.delete(id);
					reject(new Error("Request timeout: getClientSecret"));
				}
			}, 10000);
		});
	}

	public destroy(): void {
		if (this.messageListener) {
			window.removeEventListener("message", this.messageListener);
			this.messageListener = null;
		}
		this.pendingRequests.clear();
	}
}
