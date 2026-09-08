import { UserService } from "./services/userService";

// Dev seed: make sure a test user exists so you have something to log in with locally.
export const seedDevUser = async () => {
  const seedEmail = "lukas1.pock@gmail.com";
  const seedPassword = "password123";

  const existingSeedUser = await UserService.getUserByEmail(seedEmail);
  if (existingSeedUser) return;

  await UserService.createUser({
    name: "Lukas",
    email: seedEmail,
    password: seedPassword,
  });
  console.log(`Seeded dev user: ${seedEmail} / ${seedPassword}`);
};
