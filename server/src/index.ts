import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import chatRouter from "./routes/chat.route";

const PORT = 3001;

const app = new Hono();

app.use("*", logger());

app.use(
	"/*",
	cors({
		origin: ["http://localhost:5000", "https://api.ui-kit.com"],
	}),
);

app.get("/", (c) => {
	return c.text("Welcome to Cortex UI Kit API!");
});

app.route("/chat", chatRouter);

serve({
	fetch: app.fetch,
	port: PORT,
});

console.log(`Server is running on port http://localhost:${PORT}`);
