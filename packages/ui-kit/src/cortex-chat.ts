import type { CortexUIKitOptions } from "@cortex-ai/ui-kit-shared";
import {
	CHAT_STATIC_APP_HOSTED_URL,
	type CortexChatOptions,
} from "@cortex-ai/ui-kit-shared/chat";
import { ElementBridgeExtension } from "./classes/bridge-extension";

const IFRAME_SRC = process.env.IFRAME_SRC || CHAT_STATIC_APP_HOSTED_URL;

class CortexChatElement extends ElementBridgeExtension<CortexChatOptions> {
	private localChatOptions: CortexChatOptions | null = null;
	private localUIKitOptions: CortexUIKitOptions | null = null;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback(): void {
		if (this.localChatOptions && this.localUIKitOptions) {
			this.render();
		}
	}

	setOptions(options: CortexChatOptions & CortexUIKitOptions): void {
		const { api, ...chatOptions } = options;

		this.localChatOptions = {
			agentId: chatOptions.agentId,
			theme: {
				colorScheme: "light",
				accentColor: "blue",
				neutralColor: "zinc",
				...chatOptions.theme,
			},
			startScreen: {
				greeting: "Hello! How can I help you today?",
				...chatOptions.startScreen,
			},
			composer: {
				placeholder: "Type a message...",
				...chatOptions.composer,
			},
		};

		this.localUIKitOptions = { api };

		this.render();
	}

	private render(): void {
		if (!this.localChatOptions || !this.localUIKitOptions || !this.shadowRoot) {
			return;
		}

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
      <iframe src="${IFRAME_SRC}"></iframe>
    `;

		const iframe = this.shadowRoot.querySelector("iframe");
		if (iframe) {
			this.initialize(this.localChatOptions, this.localUIKitOptions, iframe);
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
