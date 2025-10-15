import { Hono } from "hono";
import { createCortexService } from "../services/cortex.service";

export interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ChatRequest {
	messages: ChatMessage[];
	clientSecret: string;
	workflowId: string;
}

const chatRouter = new Hono();

chatRouter.post("/", async (c) => {
	try {
		const body = await c.req.json<ChatRequest>();
		const { messages, clientSecret, workflowId } = body;

		if (!messages || !Array.isArray(messages)) {
			return c.json({ error: "messages array is required" }, 400);
		}

		if (!clientSecret) {
			return c.json({ error: "clientSecret is required" }, 400);
		}

		if (!workflowId) {
			return c.json({ error: "workflowId is required" }, 400);
		}

		const cortexService = createCortexService({
			apiKey: clientSecret,
		});

		const response = await cortexService.runWorkflowStream({
			workflowId,
			input: { messages },
		});

		return response;
	} catch (error) {
		if (error instanceof Error) {
			return c.json(
				{
					error: error.message,
					type: "cortex_error",
				},
				500,
			);
		}

		return c.json({ error: "Internal server error" }, 500);
	}
});

export default chatRouter;
