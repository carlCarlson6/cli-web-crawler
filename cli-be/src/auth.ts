import "dotenv/config";
import { clerkClient, getAuth } from "@clerk/express";
import { type Request } from "express";

export const getCurrentUser = async (req: Request) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId ?? "");
  if (!user) throw new Error("UNAUTHENTICATED");
  return {
    id:   user.id,
    name: user.fullName,
    email: user.primaryEmailAddress?.emailAddress,
  }
}