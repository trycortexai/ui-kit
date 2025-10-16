import {
	BridgeMessageType,
	type BridgeMessageUnion,
	type CortexUIKitAPIOptions,
	type ErrorMessage,
	isBridgeMessage,
	type RequestClientSecretMessage,
	type ResponseClientSecretMessage,
} from "@cortex-ai/ui-kit-shared";

export abstract class CortexBridge extends HTMLElement {
	private apiOptions: CortexUIKitAPIOptions | null = null;
	private iframe: HTMLIFrameElement | null = null;
	private boundHandleMessage: ((event: MessageEvent) => Promise<void>) | null =
		null;

	constructor() {
		super();
		this.boundHandleMessage = this.handleMessage.bind(this);
		window.addEventListener("message", this.boundHandleMessage);
	}

	protected initialize(
		apiOptions: CortexUIKitAPIOptions,
		iframe: HTMLIFrameElement,
	): void {
		this.apiOptions = apiOptions;
		this.iframe = iframe;
	}

	private async handleMessage(event: MessageEvent): Promise<void> {
		if (!this.iframe || event.source !== this.iframe.contentWindow) {
			return;
		}

		const message = event.data;

		if (!isBridgeMessage(message)) {
			return;
		}

		try {
			await this.processMessage(message);
		} catch (error) {
			this.sendError(
				message.id,
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	}

	private async processMessage(message: BridgeMessageUnion): Promise<void> {
		switch (message.type) {
			case BridgeMessageType.REQUEST_CLIENT_SECRET:
				await this.handleClientSecretRequest(
					message as RequestClientSecretMessage,
				);
				break;
		}
	}

	private async handleClientSecretRequest(
		message: RequestClientSecretMessage,
	): Promise<void> {
		if (!this.apiOptions) {
			throw new Error("API options not initialized");
		}

		const clientSecret = await this.apiOptions.getClientSecret();

		const response: ResponseClientSecretMessage = {
			id: message.id,
			type: BridgeMessageType.RESPONSE_CLIENT_SECRET,
			payload: { clientSecret },
		};

		this.sendMessage(response);
	}

	private sendMessage(message: BridgeMessageUnion): void {
		if (!this.iframe?.contentWindow) {
			throw new Error("Iframe not initialized");
		}

		this.iframe.contentWindow.postMessage(message, "*");
	}

	private sendError(id: string, error: string): void {
		const errorMessage: ErrorMessage = {
			id,
			type: BridgeMessageType.ERROR,
			payload: { error },
		};

		this.sendMessage(errorMessage);
	}

	public destroy(): void {
		if (this.boundHandleMessage) {
			window.removeEventListener("message", this.boundHandleMessage);
			this.boundHandleMessage = null;
		}
		this.apiOptions = null;
		this.iframe = null;
	}
}
