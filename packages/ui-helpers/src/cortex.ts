import { Cortex } from "@cortex-ai/sdk";

export function getCortexInstance(apiKey: string): Cortex {
	return new Cortex({ apiKey });
}
