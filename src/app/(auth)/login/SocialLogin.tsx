import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { FaInstagram } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const onClick = (provider: "google" | "instagram") => {
    signIn(provider, {
      redirectTo: "/dogs",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      <Button
        size="lg"
        fullWidth
        variant={"bordered"}
        onClick={() => onClick("google")}
      >
        <FcGoogle size={30} />
      </Button>
      {/*<Button*/}
      {/*  size="lg"*/}
      {/*  fullWidth*/}
      {/*  variant={"bordered"}*/}
      {/*  onClick={() => onClick("instagram")}*/}
      {/*>*/}
      {/*  <FaInstagram size={30} />*/}
      {/*</Button>*/}
    </div>
  );
}
