import { Cortex } from "@cortex-ai/sdk";

const BASE_CORTEX_API_URL = "https://api.withcortex.ai";

export function getCortexInstance(clientSecret: string): Cortex {
	return new Cortex({
		apiKey: clientSecret,
		baseUrl: BASE_CORTEX_API_URL,
	});
}

export function parseMessageFromStepOutput(
	stepOutput: any | undefined,
): string {
	const stepOutputOutput = stepOutput?.output;
	if (!stepOutputOutput) return "";
	return typeof stepOutputOutput === "string"
		? stepOutputOutput
		: "message" in stepOutputOutput &&
				typeof stepOutputOutput.message === "string"
			? stepOutputOutput.message
			: "";
}
