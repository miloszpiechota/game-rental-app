import type { AppUser } from "../types";
import { createPasswordDigest } from "../lib/auth";

export const DEMO_USER_ID = "u-demo";
export const DEMO_EMAIL = "demo@gralnia.pl";
export const DEMO_PASSWORD = "demo123";

export const getSeedUsers = (): AppUser[] => [
  {
    id: DEMO_USER_ID,
    name: "Jan Kowalski",
    email: DEMO_EMAIL,
    role: "pracownik",
    passwordDigest: createPasswordDigest(DEMO_PASSWORD),
    joinedAt: new Date().toISOString()
  }
];
