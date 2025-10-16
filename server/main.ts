import { UI_KIT_DEV_SERVER_PORT } from "@cortex-ai/ui-kit-shared";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import chatRouter from "./routes/chat.route";

const app = new Hono();

app.use("*", logger());

app.use(
	"/*",
	cors({
		origin: "*",
		credentials: process.env.NODE_ENV === "production",
	}),
);

app.get("/", (c) => {
	return c.text("Welcome to Cortex UI Kit API!");
});

app.route("/chat", chatRouter);

app.get("/health", (c) => {
	return c.json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
	});
});

app.onError((err, c) => {
	console.error(`[Error] ${err.message}`);
	console.error(err.stack);

	if (process.env.NODE_ENV === "production") {
		return c.json(
			{
				error: {
					message: "Internal Server Error",
					id: crypto.randomUUID(),
				},
			},
			500,
		);
	}

	return c.json(
		{
			error: {
				message: err.message,
				stack: err.stack,
			},
		},
		500,
	);
});

app.notFound((c) => {
	return c.json(
		{
			status: 404,
			message: "Not Found",
		},
		404,
	);
});

export default {
	port: Number(process.env.PORT) || UI_KIT_DEV_SERVER_PORT,
	fetch: app.fetch,
};
