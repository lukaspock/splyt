import { router } from "./trpc";
import { authRouter } from "./routers/authRouter";
import {userRouter} from "./routers/userRouter";

export const appRouter = router({
  auth: authRouter,
  users: userRouter
});

export type AppRouter = typeof appRouter;
