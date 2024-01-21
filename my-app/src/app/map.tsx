'use client'
import { RefObject, useEffect, useRef, useState } from "react"
import {
    E_SDK_EVENT,
    getVenueMaker,
    Mappedin,
    MappedinDestinationSet,
    MappedinLocation,
    MapView,
    showVenue,
    TGetVenueMakerOptions,
} from "@mappedin/mappedin-js"
import "@mappedin/mappedin-js/lib/mappedin.css"

const useVenue = (options: TGetVenueMakerOptions) => {
    const [venue, setVenue] = useState<Mappedin | undefined>()
    useEffect(() => {
        getVenueMaker(options).then(v => setVenue(v))
    }, [])
    return venue
}

const useMapView = (venue?: Mappedin, map_ref?: RefObject<HTMLDivElement>) => {
    const [mapView, setMapView] = useState<MapView>()
    useEffect(() => {
        if (venue === undefined || map_ref === undefined || !map_ref.current) return
        showVenue(map_ref.current, venue).then(mapView => {
            mapView.setMap("m_6c647f948adbbe52")
            setMapView(mapView)
        })
    }, [venue])

    useEffect(() => {
        if (mapView === undefined) return

        mapView.on(E_SDK_EVENT.CLICK, () => {
            mapView.FloatingLabels.labelAllLocations()
        })
        return () => {
            mapView.FloatingLabels.removeAll()
        }
    }, [mapView])

    return mapView
}


export default function Map({ shelfNumber }: { shelfNumber: number | null }) {
    const shelf_number_to_code = (shelfNumber: number) => {
        //divide shelf number by 7 to get character
        // modulo 7 to get number, if greater than 7 set to 7
        const alphNumber = String.fromCharCode(((shelfNumber / 7) + 64))
        let remainder = (shelfNumber % 7)
        return `Shelf ${alphNumber}${remainder + 1}`
    }

    const path_to_shelf = () => {
        if (!shelfNumber) return
        if (!mapView || !venue) return
        const startLocation = venue.locations.find(l => l.name === "240A")
        const shelf_code = shelf_number_to_code(shelfNumber);
        const endLocation = venue.locations.find(l => l.name == shelf_code)
        if (!startLocation || !endLocation) return
        const directions = startLocation.directionsTo(endLocation)
        mapView.Journey.draw(directions, {
            pathOptions: {
              color: "blue",
              nearRadius: 1,
              farRadius:0
            }
        });
        mapView.StackedMaps.enable({ verticalDistanceBetweenMaps: 20 })
        mapView.StackedMaps.showOverview()

        
    }

    const mapViewElement = useRef<HTMLDivElement>(null)
    const venue = useVenue({
        mapId: process.env.NEXT_PUBLIC_MAPPEDIN_ID!,
        key: process.env.NEXT_PUBLIC_MAPPEDIN_KEY!,
        secret: process.env.NEXT_PUBLIC_MAPPEDIN_SECRET!,
    })
    const mapView = useMapView(venue, mapViewElement)

    useEffect(() => { 
        console.log("shelf number changed to ", shelfNumber)
        path_to_shelf()
    }, [shelfNumber])

    useEffect(() => {
        if(!mapView || !venue)return;
       mapView.on(E_SDK_EVENT.MAP_CHANGED,() => {
        const startLocation = venue.locations.find((location) => location.name === "Ike's Cafe");
        const destinations = [
            venue.locations.find((location) => location.name === 'Shelf A1'),
            venue.locations.find((location) => location.name == 'Shelf Z1'),
        ] as MappedinLocation[];
        if(!destinations || !startLocation)return;
        const directions = startLocation.directionsTo(
            new MappedinDestinationSet(destinations));
            mapView.Journey.draw(directions, {
                pathOptions: {
                  color: "blue",
                  nearRadius: 1,

                }
            });
        mapView.StackedMaps.enable({ verticalDistanceBetweenMaps: 20 })
        mapView.StackedMaps.showOverview()
       })

       mapView.on(E_SDK_EVENT.CLICK,({position}) => {
        const coordinate = mapView.currentMap.createCoordinate(
            position.latitude,
            position.longitude
        );

        const nearestNode = coordinate.nearestNode;

        const destinations = [
            venue.locations.find((location) => location.name === 'Shelf A1'),
            venue.locations.find((location) => location.name == 'Shelf Z1'),
        ] as MappedinLocation[];
        if(!destinations)return;
        const directions = nearestNode.directionsTo(
            new MappedinDestinationSet(destinations));
            mapView.Journey.draw(directions, {
                pathOptions: {
                  color: "blue",
                  nearRadius: 1,
                  farRadius:0
                }
            });  
        mapView.StackedMaps.enable({ verticalDistanceBetweenMaps: 20 })
        mapView.StackedMaps.showOverview()
       })

    },[mapView])

    return (
        <div id="map_element" ref={mapViewElement} className="w-screen h-screen">
            {/* <div className="flex flex-col inset-x-10 inset-y-20 absolute z-50 text-xl border-rounded-md"> */}
            {/* <button className="w-8 h-8 bg-slate-100 m-1 p-0 text-center rounded-sm" onClick={() => setlevel(Math.min(level+1, 3))}>+</button>
                <button className="w-8 h-8 bg-slate-100 m-1 p-0 text-center rounded-sm" onClick={() => setlevel(Math.max(level-1, 0))}>-</button> */}
        </div>
    )
}