import { auth, signOut } from "@/auth";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaBeer } from "react-icons/fa";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome!</h1>
      {session ?
        (
          <div>
            <h2>Welcome back, {session.user?.name}!</h2>
            <p>See the lists tab to view who you have liked and who has liked you</p>
          </div>
        ) :
        (
          <div>
            <p>Sign in to see who you have liked and who has liked you</p>
          </div>
        )
      }

    </div>
  );
}
