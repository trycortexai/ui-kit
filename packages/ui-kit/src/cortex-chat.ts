import type { CortexUIKitOptions } from "@cortex-ai/ui-kit-shared";
import {
	CHAT_STATIC_APP_HOSTED_URL,
	type CortexChatOptions,
} from "@cortex-ai/ui-kit-shared/chat";
import { encodeObject } from "@cortex-ai/ui-kit-shared/common";
import { ElementBridgeExtension } from "./classes/bridge-extension";

const IFRAME_SRC = process.env.IFRAME_SRC || CHAT_STATIC_APP_HOSTED_URL;

class CortexChatElement extends ElementBridgeExtension {
	private options: (CortexChatOptions & CortexUIKitOptions) | null = null;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback(): void {
		if (this.options) {
			this.render();
		}
	}

	setOptions(options: CortexChatOptions & CortexUIKitOptions): void {
		this.options = options;
		this.render();
	}

	private getSerializableOptions(): CortexChatOptions {
		if (!this.options) {
			throw new Error(
				"Options not set. Call setOptions() before rendering the chat component.",
			);
		}

		return {
			agentId: this.options.agentId,
			theme: {
				colorScheme: "light",
				accentColor: "blue",
				neutralColor: "zinc",
				...this.options.theme,
			},
			startScreen: {
				greeting: "Hello! How can I help you today?",
				...this.options.startScreen,
			},
			composer: {
				placeholder: "Type a message...",
				...this.options.composer,
			},
		};
	}

	private getIframeUrl(): string {
		const serializableOptions = this.getSerializableOptions();
		return `${IFRAME_SRC}#${encodeObject(serializableOptions)}`;
	}

	private render(): void {
		if (!this.options || !this.shadowRoot) {
			return;
		}

		const iframeUrl = this.getIframeUrl();

		this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 500px;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
      <iframe src="${iframeUrl}"></iframe>
    `;

		const iframe = this.shadowRoot.querySelector("iframe");
		if (iframe && this.options.api) {
			iframe.addEventListener("load", () => {
				this.initialize(this.options!.api, iframe);
			});
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"cortex-chat": CortexChatElement;
	}

	namespace JSX {
		interface IntrinsicElements {
			"cortex-chat": Partial<CortexChatElement>;
		}
	}
}

customElements.define("cortex-chat", CortexChatElement);
