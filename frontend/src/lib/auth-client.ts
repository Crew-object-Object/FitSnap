import { createAuthClient } from "better-auth/react";

const auth_client = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
});

export const { signIn, signOut, signUp, useSession } = auth_client;