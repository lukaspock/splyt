import {protectedProcedure, router} from "../trpc";
import {UserService} from "../services/userService";
import {SafeUser} from "../types/User";

export const userRouter = router({
    getMe: protectedProcedure.query(
        async ({ctx}): Promise<SafeUser> => {
            const user = await UserService.getUserById(ctx.userId);
            const {password, ...safeUser} = user;
            return safeUser;
        }
    )
})