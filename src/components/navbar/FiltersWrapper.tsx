"use client";

import { usePathname } from 'next/navigation'
import React from 'react'
import Filters from './Filters';

export default function FiltersWrapper() {
  const pathname = usePathname();

  if (pathname === "/dogs") {
    return <Filters />
  } else {
    return null;
  }
}
