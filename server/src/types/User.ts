
import { z } from 'zod';

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    password: z.string(),

})

export const UserInputSchema = UserSchema.omit({id: true});
export const SafeUserSchema = UserSchema.omit({password: true});

export type User = z.infer<typeof UserSchema>;
export type UserInput = z.infer<typeof UserInputSchema>;
export type SafeUser = z.infer<typeof SafeUserSchema>;



