import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the 'id' property here
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string; // Add 'id' to the User type if you are using it elsewhere
  }
}
