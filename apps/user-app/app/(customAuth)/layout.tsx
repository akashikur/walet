import { getServerSession } from "next-auth";
import Signin from "./signin/page";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import Signup from "./signup/page";

export default async function Layout(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return <Signin /> || <Signup />;
}
