'use client'

import NavBar from "~/components/navBar"
import MainSearch from "~/app/mainSearch"
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
      {/* <MainSearch updateShelfNumber={setShelfNumber} /> */}

      <div className="fixed bottom-10 left-[50%] translate-x-[-50%]">
        <button className="bg-blue-400 p-4 rounded-lg" onClick={()=>{
          const newNumber = Math.floor(Math.random() * 100)
          setShelfNumber(newNumber)
        }}>
          Random Shelf Number
        </button>
      </div>
    </div>
  );
}
