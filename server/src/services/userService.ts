
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

import { User, UserInput} from "../types/User";

export const UserService = {

    getUsers: async (): Promise<User[]> => {
        return await db.select().from(users);
    },

    getUserById: async (id: string): Promise<User> => {
        return (await db.select().from(users).where(eq(users.id, id)))[0];
    },

    getUserByEmail: async (email: string): Promise<User> => {
        return (await db.select().from(users).where(eq(users.email, email)))[0];
    },

    createUser: async (user: UserInput): Promise<User> => {

        const newUser: User = {
            id: crypto.randomUUID(),
            name: user.name,
            email: user.email,
            password: await Bun.password.hash(user.password),
        };

        await db.insert(users).values(newUser);

        return newUser;
    }


}