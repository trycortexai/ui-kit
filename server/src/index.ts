import { UI_KIT_DEV_SERVER_PORT } from "@cortex-ai/ui-kit-shared";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import chatRouter from "./routes/chat.route";

const app = new Hono();

app.use("*", logger());

app.use("/*", cors());

app.get("/", (c) => {
	return c.text("Welcome to Cortex UI Kit API!");
});

app.route("/chat", chatRouter);

serve({
	fetch: app.fetch,
	port: UI_KIT_DEV_SERVER_PORT,
});

console.log(
	`Server is running on port http://localhost:${UI_KIT_DEV_SERVER_PORT}`,
);
