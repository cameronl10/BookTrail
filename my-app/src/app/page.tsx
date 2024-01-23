'use client'

import NavBar from "~/components/nav/navBar"
import SearchDrawer from "~/components/searchDrawer/mainSearch"
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
      <div className="h-screen">
      <SearchDrawer updateShelfNumber={setShelfNumber} />
      </div>
    </div>
  );
}
