import React from 'react'
import { Dog } from "@prisma/client"
import { GoDot, GoDotFill} from "react-icons/go";
import usePresenceStore from "@/app/hooks/usePresenceStore"

type Props = {
  dog: Dog;
}

export default function PresenceDot({dog}: Props) {
  const members = usePresenceStore(state => state.members)

  const isOnline = members.indexOf(dog.userId) !== -1;

  if (!isOnline) return null;

  return (
    <>
      <GoDot size={36} className="fill-white absolute -top-[2px] -right-[2px]"/>
      <GoDotFill size={32} className="fill-green-500 animate-pulse" />
    </>
  )
}
