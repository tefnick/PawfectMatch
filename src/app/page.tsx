import { auth } from "@/auth";
import { IoPaw } from "react-icons/io5";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-6 text-primary">
      <IoPaw size={100} />
      <h1 className={"text-4xl font-bold"}>Welcome to Pawfect Match</h1>
      {session ? (
        <Button
          as={Link}
          href={"/dogs"}
          size={"lg"}
          color={"primary"}
          variant={"shadow"}
        >
          Continue
        </Button>
      ) : (
        <div className={"flex flex-row gap-4"}>
          <Button as={Link} href="/login" size={"lg"} variant="bordered">
            Sign in
          </Button>
          <Button as={Link} href="/register" size={"lg"} variant="bordered">
            Register
          </Button>
        </div>
      )}
    </div>
  );
}
