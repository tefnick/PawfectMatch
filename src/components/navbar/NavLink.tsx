"use client";

import useMessageStore from "@/app/hooks/useMessageStore";
import { NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavLinkProps = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  const unreadCount = useMessageStore((state) => state.unreadCount);

  return (
    <>
      <NavbarItem isActive={pathname === href} as={Link} href={href}>
        <span>{label}</span>
        {href === "/messages" && unreadCount > 0 && (
          <span className="ml-1">({unreadCount})</span> //TODO: figure out NAN error
        )}
      </NavbarItem>
    </>
  );
}
