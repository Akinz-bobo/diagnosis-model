import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

// Create a simple handler without any dynamic imports or advanced logic
// to avoid the "Cannot read properties of undefined (reading 'length')" error
const handler = NextAuth(authOptions);

// Export the handler as GET and POST methods
export { handler as GET, handler as POST };
