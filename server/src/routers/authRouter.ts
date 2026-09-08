import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {User} from "../types/User";
import { UserService } from "../services/userService";
import Bun from "bun";
import {TRPCError} from "@trpc/server";
import jwt from "jsonwebtoken";

export const authRouter = router({
    login: publicProcedure
        .input(z.object({email: z.string().email(), password: z.string()}
        ))
        .mutation(async ({input}) => {
            const {email, password} = input;

            const user: User | undefined = await UserService.getUserByEmail(email);

            if (!user || !(await Bun.password.verify(password, user.password))) {
                throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET!, {expiresIn: "7d"});
            return {token};
        })

})