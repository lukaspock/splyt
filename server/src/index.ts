import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { seedDevUser } from "./seed";
import { appRouter } from "./router";
import { createContext} from "./trpc";

const app = new Hono();

app.get("/", (c) => c.text("SPLYT API is running"));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
      createContext,
  })
);

await seedDevUser();

export default app;
