import { faker } from "@faker-js/faker";
import { auth } from "@/shared/lib/auth.ts";

export async function seedUser(length: number = 1) {
  for (let i = 0; i < length; i++) {
    const email = faker.internet.email();
    const name = faker.internet.displayName();
    const password = "developer";

    await auth.api.signUpEmail({
      body: {
        email,
        name,
        password
      }
    });
  }

  console.log(`User seeded: ${length}`);

  return;
}
