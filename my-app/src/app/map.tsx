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
        getVenueMaker(options).then(v=> setVenue(v));
    }, [])
    return venue;
}

const useMapView = (venue?: Mappedin, map_ref?: RefObject<HTMLDivElement>) => {
    const [mapView, setMapView] = useState<MapView>();
    useEffect(() => {
        if(venue === undefined || map_ref === undefined || !map_ref.current) return;
        showVenue(map_ref.current, venue).then(mapView => {
            
            setMapView(mapView)
        })
    }, [venue])

    useEffect(() => {
        if(mapView === undefined) return;
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
    return (
        <div id="map_element" ref={mapViewElement} className="w-screen h-screen"></div>
    )
}