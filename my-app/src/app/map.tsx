'use client';
import { RefObject, useEffect, useRef, useState } from "react";
import {
    E_SDK_EVENT,
    getVenueMaker,
    Mappedin,
    MapView,
    showVenue,
    TGetVenueMakerOptions,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";


const useVenue = (options: TGetVenueMakerOptions) => {
    const [venue, setVenue] = useState<Mappedin | undefined>();
    useEffect(() => {
        getVenueMaker(options).then(v => setVenue(v));
    }, [])
    return venue;
}

const useMapView = (venue?: Mappedin, map_ref?: RefObject<HTMLDivElement>) => {
    const [mapView, setMapView] = useState<MapView>();
    useEffect(() => {
        console.log("rendering map");
        if (venue === undefined || map_ref === undefined || !map_ref.current) return;
        showVenue(map_ref.current, venue).then(mapView => {
            console.log(venue.maps)
            mapView.setMap("m_dfd17e8df1852ed9");
            setMapView(mapView)
        })
    }, [venue])

    useEffect(() => {
        if (mapView === undefined) return;

        mapView.on(E_SDK_EVENT.CLICK, () => {
            mapView.FloatingLabels.labelAllLocations();


        })
        return () => {
            mapView.FloatingLabels.removeAll();
        }
    }, [mapView])

    return mapView;
}


export default function Map() {
    const mapViewElement = useRef<HTMLDivElement>(null);
    const venue = useVenue({
        mapId: process.env.NEXT_PUBLIC_MAPPEDIN_ID!,
        key: process.env.NEXT_PUBLIC_MAPPEDIN_KEY!,
        secret: process.env.NEXT_PUBLIC_MAPPEDIN_SECRET!,
    });
    
    
    const mapView = useMapView(venue, mapViewElement);
    useEffect(() => {
        if(!venue || !mapView)return;
    //    const startLocation = venue.locations.find((location) => location.name === "240B");
    //     const endLocation = venue.locations.find((location) => location.name === "418");
    //     if(!startLocation || !endLocation) return;
    //     const directions = startLocation.directionsTo(endLocation);
    //     mapView.Journey.draw(directions);
        
    mapView.on(E_SDK_EVENT.CLICK, ({ position }) => {
        
        const coordinate = mapView.currentMap.createCoordinate(
          position.latitude,
          position.longitude
        );
        const nearestNode = coordinate.nearestNode;
        console.log(nearestNode);
        const endLocation = venue.locations.find(
          (location) => location.name === "419"
        );
        if(!endLocation) return;
        const directions = nearestNode.directionsTo(endLocation);
      
        mapView.Journey.draw(directions);

        mapView.StackedMaps.enable({
            verticalDistanceBetweenMaps:30
        })
        mapView.StackedMaps.showOverview();
      });
      

        return () => {  
            console.log("journey unmounted")
            mapView.Journey.clear();
        }
    }, [venue, mapView])
    



    return (
        <div id="map_element"  ref={mapViewElement} className="w-screen h-screen">
                  {/* <div className="flex flex-col inset-x-10 inset-y-20 absolute z-50 text-xl border-rounded-md"> */}
                {/* <button className="w-8 h-8 bg-slate-100 m-1 p-0 text-center rounded-sm" onClick={() => setlevel(Math.min(level+1, 3))}>+</button>
                <button className="w-8 h-8 bg-slate-100 m-1 p-0 text-center rounded-sm" onClick={() => setlevel(Math.max(level-1, 0))}>-</button> */}
            </div>
      
    )
}