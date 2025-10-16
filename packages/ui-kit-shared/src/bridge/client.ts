import {
	BridgeMessageType,
	type BridgeMessageUnion,
	type ErrorMessage,
	isBridgeMessage,
	type RequestClientSecretMessage,
	type RequestOptionsMessage,
	type ResponseClientSecretMessage,
	type ResponseOptionsMessage,
} from ".";

type PendingRequest<T = unknown> = {
	resolve: (value: T) => void;
	reject: (error: Error) => void;
};

export class BridgeClient<TUIOptions = unknown> {
	private pendingRequests: Map<string, PendingRequest<any>> = new Map();
	private messageListener: ((event: MessageEvent) => void) | null = null;
	private cachedOptions: TUIOptions | null = null;
	private cachedClientSecret: string | null = null;

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

		this.processMessage(message as BridgeMessageUnion<TUIOptions>);
	}

	private processMessage(message: BridgeMessageUnion<TUIOptions>): void {
		const pending = this.pendingRequests.get(message.id);

		if (!pending) {
			console.warn(
				"BridgeClient: No pending request for message id",
				message.id,
			);
			return;
		}

		this.pendingRequests.delete(message.id);

		switch (message.type) {
			case BridgeMessageType.RESPONSE_OPTIONS:
				{
					const response = message as ResponseOptionsMessage<TUIOptions>;
					const options = response.payload.uiOptions;
					this.cachedOptions = options;
					pending.resolve(options);
				}
				break;

			case BridgeMessageType.RESPONSE_CLIENT_SECRET:
				{
					const response = message as ResponseClientSecretMessage;
					this.cachedClientSecret = response.payload.clientSecret;
					pending.resolve(response.payload.clientSecret);
				}
				break;

			case BridgeMessageType.ERROR:
				{
					const error = message as ErrorMessage;
					console.error("BridgeClient: Error received", error.payload.error);
					pending.reject(new Error(error.payload.error));
				}
				break;
		}
	}

	public async getOptions(): Promise<TUIOptions> {
		if (this.cachedOptions) {
			return this.cachedOptions;
		}

		return new Promise((resolve, reject) => {
			const id = crypto.randomUUID();

			this.pendingRequests.set(id, { resolve, reject });

			const request: RequestOptionsMessage = {
				id,
				type: BridgeMessageType.REQUEST_OPTIONS,
			};

			window.parent.postMessage(request, "*");

			setTimeout(() => {
				if (this.pendingRequests.has(id)) {
					this.pendingRequests.delete(id);
					console.error("BridgeClient: Request timeout for getOptions");
					reject(new Error("Request timeout: getOptions"));
				}
			}, 10000);
		});
	}

	public async getClientSecret(): Promise<string> {
		if (this.cachedClientSecret) {
			return this.cachedClientSecret;
		}

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
		this.cachedOptions = null;
		this.cachedClientSecret = null;
	}
}
