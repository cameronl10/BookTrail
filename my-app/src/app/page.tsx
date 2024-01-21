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
'use client';

import React, { useState } from "react";

export default function Home() {
  useEffect(() => {
    async function init(){
      const venue = await getVenueMaker(options);
      const mapView = await showVenue(document.getElementById("app")!, venue);

    }
    init();
  },[])
  const [count, setCount] = useState(0);

  return (
    
    <div className="w-screen h-screen flex-1 bg-slate-700 p-0">
      <div className="bg-red-600 h-[36px] flex flex-row">
        <div className="w-[117px] h-[36px] px-7 py-2">
          <img src='logo.png' alt="./logo.png"/>
        </div>
        <div className="w-2/3 h-16">

        </div>
        <div className="w-1/6">
          Login
        </div>
        <div className="w-1/6">
          Sign Up
        </div>
      </div>


      <div className="h-full bg-green-600">
        <div className="h-3/4 bg-green-600">
            test
        </div>
        <div className="h-1/4 bg-purple-900 rounded-t-[24px]" onClick={() => setCount(count+1)}>
          e
        </div>
      </div>
    </div>
  );
}
