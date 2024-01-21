'use client'

import NavBar from "~/components/navBar"
import MainSearch from "~/components/mainSearch"
import React from "react";
import dynamic from "next/dynamic";
import {useState} from "react"
const Map = dynamic(() => import("./map"), {
  ssr: false,
});


export default function Home() {
  const[shelfNumber,setShelfNumber] = useState(0);

  const updateShelfNumber = (newNum: number) => {
    setShelfNumber(newNum);
  }

  return (
    <div className="relative">
      <Map shelfNumber={shelfNumber}/>
      <NavBar />
      <MainSearch  updateShelfNumber={updateShelfNumber} />
    </div>
  );
}
