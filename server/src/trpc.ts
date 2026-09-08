import { initTRPC, TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";

export const createContext = async (opts: { req: Request }) => {
    const authHeader = opts.req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    return { token };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();

const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
        const payload = jwt.verify(ctx.token, process.env.JWT_SECRET!) as { id: string };
        return next({ ctx: { ...ctx, userId: payload.id } }); // reicht userId an den Resolver weiter
    } catch {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(isAuthed);

