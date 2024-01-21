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
        if(venue === undefined || map_ref === undefined || map_ref.current === null) return;
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
        mapId: "65ac471fca641a9a1399dc2b",
        key: "65ac6209ca641a9a1399dc4c",
        secret: "f85d70b9f1b60514543db48191e581de0827c4f01c3e545e3e2e66ec690ecd14",
    });
    const mapView = useMapView(venue, mapViewElement);

    return (
        <div id="map_element" ref={mapViewElement} className="w-screen h-screen"></div>
    )
}