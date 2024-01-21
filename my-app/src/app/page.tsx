'use client'

import NavBar from "~/components/navBar"
import MainSearch from "~/app/mainSearch"
import React from "react";
import dynamic from "next/dynamic";
import { useState } from "react"
const Map = dynamic(() => import("./map"), {
  ssr: false,
});

export default function Home() {
  const [shelfNumber, setShelfNumber] = useState<number | null>(null);
  return (
    <div className="relative">
      <Map shelfNumber={shelfNumber} />
      <NavBar />
      <MainSearch updateShelfNumber={setShelfNumber} />
    </div>
  );
}
