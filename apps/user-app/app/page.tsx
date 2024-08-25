import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/auth";
import Signin from "./signin/page";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/dashboard");
  } else {
    return <Signin />;
  }
}
