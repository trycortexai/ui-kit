import {
	CHAT_STATIC_APP_HOSTED_URL,
	type CortexChatOptions,
} from "@cortex-ai/ui-kit-shared/chat";
import { encodeObject } from "@cortex-ai/ui-kit-shared/common";

const IFRAME_SRC = process.env.IFRAME_SRC || CHAT_STATIC_APP_HOSTED_URL;

class CortexChatElement extends HTMLElement {
	private options: CortexChatOptions | null = null;

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback(): void {
		if (this.options) {
			this.render();
		}
	}

	setOptions(options: CortexChatOptions): void {
		this.options = options;
		this.render();
	}

	private getResolvedOptions(): CortexChatOptions {
		if (!this.options) {
			throw new Error(
				"Options not set. Call setOptions() before rendering the chat component.",
			);
		}

		return {
			...this.options,
			theme: {
				...this.options.theme,
				colorScheme: this.options.theme?.colorScheme || "light",
				accentColor: this.options.theme?.accentColor || "blue",
				neutralColor: this.options.theme?.neutralColor || "zinc",
			},
			startScreen: {
				...this.options.startScreen,
				greeting:
					this.options.startScreen?.greeting ||
					"Hello! How can I help you today?",
			},
		};
	}

	private getIframeUrl(): string {
		const resolvedOptions = this.getResolvedOptions();
		return `${IFRAME_SRC}#${encodeObject(resolvedOptions)}`;
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
