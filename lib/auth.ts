import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export function auth() {
  return getServerSession(authOptions);
}

export const getCurrentUser = async () => {
  const session = await auth();
  console.log("user is here", session?.user);
  return session?.user;
};
