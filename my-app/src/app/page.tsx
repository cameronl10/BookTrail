'use client'
import {useEffect } from "react";
import NavBar from "~/components/navBar"
import MainSearch from "~/components/mainSearch"

import {
  E_SDK_EVENT,
  getVenueMaker,
  showVenue,
  TGetVenueMakerOptions,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";

const options: TGetVenueMakerOptions = {
  mapId: "65ac471fca641a9a1399dc2b",
  key: "65ac6209ca641a9a1399dc4c",
  secret: "f85d70b9f1b60514543db48191e581de0827c4f01c3e545e3e2e66ec690ecd14",
};

const initMap = async () =>{
      const venue = await getVenueMaker(options);
      await showVenue(document.getElementById("app")!, venue).then((mapView) =>{
        
      mapView.on(E_SDK_EVENT.CLICK, ()=>{
        mapView.FloatingLabels.labelAllLocations();
      })
    });
  }
import React, { useState } from "react";

export default function Home() {
  useEffect(() => {
    initMap();
  },[])
  const [count, setCount] = useState(0);

  return (
<<<<<<< Updated upstream
    <div className="w-screen h-screen">
=======
    <div id="app">
      
>>>>>>> Stashed changes
      <NavBar/>
      <div id="app" className="absolute top-0 max-h-screen"></div>
      <MainSearch></MainSearch>
    </div>
  );
}
