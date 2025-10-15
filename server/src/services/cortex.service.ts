import type { Schema } from "@cortex-ai/sdk";
import { Cortex } from "@cortex-ai/sdk";

export interface CortexConfig {
	apiKey: string;
	baseUrl?: string;
}

export interface WorkflowRunOptions {
	workflowId: string;
	input: Record<string, any>;
	onStream?: (data: any, event: unknown) => void;
}

export interface StepRunOptions {
	step: Schema["StepSchema"];
	onStream?: (data: any, event: unknown) => void;
}

export class CortexService {
	private client: Cortex;

	constructor(config: CortexConfig) {
		this.client = new Cortex({
			apiKey: config.apiKey,
			baseUrl: config.baseUrl,
		});
	}

	async runWorkflowStream(options: WorkflowRunOptions): Promise<Response> {
		const { workflowId, input, onStream } = options;

		const response = await this.client.apps.workflows.runs.streamResponse(
			workflowId,
			{ input },
			{ onStream },
		);

		if (!(response instanceof Response)) {
			throw new Error("Expected Response object from streamResponse");
		}

		return response;
	}

	async runWorkflow(workflowId: string, input: Record<string, any>) {
		return await this.client.apps.workflows.runs.create(workflowId, { input });
	}

	async runStepStream(options: StepRunOptions): Promise<Response> {
		const { step, onStream } = options;

		const response = await this.client.apps.runs.step.streamResponse(
			{ step },
			{ onStream },
		);

		if (!(response instanceof Response)) {
			throw new Error("Expected Response object from streamResponse");
		}

		return response;
	}

	async runStep(step: Schema["StepSchema"]) {
		return await this.client.apps.runs.step.create({ step });
	}

	getClient(): Cortex {
		return this.client;
	}
}

export function createCortexService(config: CortexConfig): CortexService {
	return new CortexService(config);
}
