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
  const [mapString, setMapString] = useState<string>('initString');

  const updateString = (newString: string) =>{
    setMapString(newString);
  }

  return (
    <div className="relative">
      <Map  mapString={mapString} setMapString={updateString} />
      <NavBar />
      <MainSearch />
    </div>
  );
}
