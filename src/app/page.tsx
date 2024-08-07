import { Button } from "@nextui-org/react";
import Link from "next/link";
import { FaBeer } from "react-icons/fa";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Hello App</h1>
      <Button as={Link} href='/members' color="primary" variant="bordered" startContent={<FaBeer size={20}/>}>Click Me</Button>
    </div>
  );
}
