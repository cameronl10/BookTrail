'use client'
import {useEffect } from "react";

import {
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

export default function Home() {
  useEffect(() => {
    async function init(){
      const venue = await getVenueMaker(options);
      const mapView = await showVenue(document.getElementById("app")!, venue);

    }
    init();
  },[])
  return (
    
    <div className="">
      <div className="text-s">Hello World</div>
      <div className="text-xl">Hello World</div>
      <div className="h-3/6"id="app"></div>
    </div>
  );
}
