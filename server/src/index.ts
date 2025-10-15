import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import chatRouter from "./routes/chat.route.js";

const app = new Hono();

app.use("*", logger());

app.route("/chat", chatRouter);

serve({
	fetch: app.fetch,
	port: 3001,
});
