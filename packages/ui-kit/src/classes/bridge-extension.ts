import type { CortexUIKitOptions } from "@cortex-ai/ui-kit-shared";
import {
	BridgeMessageType,
	type BridgeMessageUnion,
	type ErrorMessage,
	isBridgeMessage,
	type RequestClientSecretMessage,
	type RequestOptionsMessage,
	type ResponseClientSecretMessage,
	type ResponseOptionsMessage,
} from "@cortex-ai/ui-kit-shared/bridge";

export abstract class ElementBridgeExtension<
	TUIOptions = unknown,
> extends HTMLElement {
	private uiOptions: TUIOptions | null = null;
	private uiKitOptions: CortexUIKitOptions | null = null;
	private iframe: HTMLIFrameElement | null = null;
	private boundHandleMessage: ((event: MessageEvent) => Promise<void>) | null =
		null;

	constructor() {
		super();
		this.boundHandleMessage = this.handleMessage.bind(this);
		window.addEventListener("message", this.boundHandleMessage);
	}

	protected initialize(
		uiOptions: TUIOptions,
		uiKitOptions: CortexUIKitOptions,
		iframe: HTMLIFrameElement,
	): void {
		this.uiOptions = uiOptions;
		this.uiKitOptions = uiKitOptions;
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
			await this.processMessage(message as BridgeMessageUnion<TUIOptions>);
		} catch (error) {
			this.sendError(
				message.id,
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	}

	private async processMessage(
		message: BridgeMessageUnion<TUIOptions>,
	): Promise<void> {
		switch (message.type) {
			case BridgeMessageType.REQUEST_OPTIONS:
				await this.handleOptionsRequest(message as RequestOptionsMessage);
				break;
			case BridgeMessageType.REQUEST_CLIENT_SECRET:
				await this.handleClientSecretRequest(
					message as RequestClientSecretMessage,
				);
				break;
		}
	}

	private async handleOptionsRequest(
		message: RequestOptionsMessage,
	): Promise<void> {
		if (!this.uiOptions) {
			console.error("Bridge: UI options not initialized!");
			throw new Error("UI options not initialized");
		}

		const response: ResponseOptionsMessage<TUIOptions> = {
			id: message.id,
			type: BridgeMessageType.RESPONSE_OPTIONS,
			payload: {
				uiOptions: this.uiOptions,
			},
		};

		this.sendMessage(response);
	}

	private async handleClientSecretRequest(
		message: RequestClientSecretMessage,
	): Promise<void> {
		if (!this.uiKitOptions) {
			throw new Error("UIKit options not initialized");
		}

		const clientSecret = await this.uiKitOptions.api.getClientSecret();

		const response: ResponseClientSecretMessage = {
			id: message.id,
			type: BridgeMessageType.RESPONSE_CLIENT_SECRET,
			payload: { clientSecret },
		};

		this.sendMessage(response);
	}

	private sendMessage(message: BridgeMessageUnion<TUIOptions>): void {
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
		this.uiOptions = null;
		this.uiKitOptions = null;
		this.iframe = null;
	}
}
