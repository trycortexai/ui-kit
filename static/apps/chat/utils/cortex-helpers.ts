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
