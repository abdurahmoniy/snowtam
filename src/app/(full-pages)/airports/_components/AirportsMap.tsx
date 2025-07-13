"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { geoMercator, geoPath, GeoPermissibleObjects } from "d3-geo";
import geoData from "@/assets/uzbekistan_regional.json";

import { Button, Drawer, Popover } from "antd";
import { UZB_REGIONS_MAPS } from "@/assets/regions";
import { REGION_COORDINATES } from "@/lib/mapUtils";

import regionDataRaw from "@/assets/uzb_geo-data_regions.json";


import raw from "@/assets/uzbekistan_regional.json";
import { IAirport } from "@/types/airport";
console.log(raw, "raw");





interface WarehousesMapProps {
    warehouses: IAirport[];
    onAirportClick?: (id: number) => void;
    onAirportSelect?: (IairportIAirport: IAirport) => void;
    onRegionSelect?: (regionId: number | null) => void;
    regionColors?: Record<number, string>;
    regionSelection?: boolean;
}

export default function AirportsMap({
    warehouses,
    onAirportClick,
    onAirportSelect,
    onRegionSelect,
    regionColors,
    regionSelection
}: WarehousesMapProps) {
    const SVG_WIDTH = 412;
    const SVG_HEIGHT = 268;
    const CENTER_X = SVG_WIDTH / 2;
    const CENTER_Y = SVG_HEIGHT / 2;
    const ZOOM_SCALE = 2;            // во сколько масштабируем
    const TRANSITION = "transform 0.4s ease";
    const PADDING = 0.8;



    const regionRef = useRef<SVGGElement>(null);
    const overlayRegionRef = useRef<SVGPathElement>(null);
    const [mapBox, setMapBox] = useState<{ x: number; y: number; width: number; height: number } | null | any>(null);

    const [selectedWarehouse, setSelectedWarehouse] = useState<IAirport | null>(null);
    const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

    const overlayPathRef = useRef<SVGPathElement>(null);
    const [overlayBox, setOverlayBox] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (regionRef.current) {
            const bb = regionRef.current.getBBox();
            setMapBox({ x: bb.x, y: bb.y, width: bb.width, height: bb.height });
        }
    }, []);

    const { tx, ty, k } = useMemo(() => {
        if (!mapBox) return { tx: 0, ty: 0, k: 1 };
        const pad = 0;
        const kx = SVG_WIDTH / mapBox.width;
        const ky = SVG_HEIGHT / mapBox.height;
        const k = Math.min(kx, ky) * pad;
        const tx = (SVG_WIDTH - mapBox.width * k) / 2 - mapBox.x * k;
        const ty = (SVG_HEIGHT - mapBox.height * k) / 2 - mapBox.y * k;
        return { tx, ty, k };
    }, [mapBox]);


    const projection = useMemo(
        () =>
            geoMercator()
                .fitSize([SVG_WIDTH, SVG_HEIGHT], regionDataRaw as any),
        []
    );

    const pathGen = useMemo(() => geoPath().projection(projection), [projection]);


    // const byRegion = warehouses.reduce<Record<number, Warehouse[]>>((acc, w) => {
    //     (acc[w.regionId] = acc[w.regionId] || []).push(w);
    //     return acc;
    // }, {});


    console.log(geoData, "geoData");




    const overlayTransform = useMemo(() => {
        if (selectedRegion == null) return { x: 0, y: 0, k: 1 };
        const coords = REGION_COORDINATES[selectedRegion];
        if (!coords) return { x: 0, y: 0, k: 1 };
        const k = ZOOM_SCALE;
        // shift region’s own (coords.x,coords.y) → (CENTER_X,CENTER_Y)
        const x = CENTER_X - coords.x * k;
        const y = CENTER_Y - coords.y * k;
        return { x, y, k };
    }, [selectedRegion]);

    const transform = useMemo(() => {
        if (!overlayBox) return { x: 0, y: 0, k: 1 };
        const { x, y, width, height } = overlayBox;
        const kx = SVG_WIDTH / width;
        const ky = SVG_HEIGHT / height;
        const k = Math.min(kx, ky) * PADDING;
        // center the box
        const tx = (SVG_WIDTH - width * k) / 2 - x * k;
        const ty = (SVG_HEIGHT - height * k) / 2 - y * k;
        return { x: tx, y: ty, k };
    }, [overlayBox]);

    useLayoutEffect(() => {
        if (selectedRegion != null && overlayPathRef.current) {
            const bb = overlayPathRef.current.getBBox();
            setOverlayBox(bb);
        }
    }, [selectedRegion]);

    return (
        <div>
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} width="100%" height="auto">
                <g id="regions">
                    {regionDataRaw.features.map((feat, i) => {
                        const rid = feat.properties.REGION_ID; // or whatever your ID field is
                        return (
                            <path
                                key={i}
                                d={pathGen(feat as any) || ""}
                                fill={regionColors?.[rid as any] || "#000"}
                                stroke="#33415C"
                                strokeWidth={0.5}
                                style={{ cursor: "pointer" }}
                            />
                        );
                    })}
                </g>
                <g id="warehouses">
                    {warehouses.map((w) => {
                        const [x, y] = projection([Number(w.longitude), Number(w.latitude)]) as [number, number];
                        return (
                            <Popover
                                key={w.id}
                                content={w.name}
                                placement="right"
                                mouseEnterDelay={0.3}
                            >
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={2.5}
                                    fill={selectedWarehouse?.id == w.id ? "#36463a" : "#FF6B6B"}
                                    stroke="#FFF"
                                    strokeWidth={0.5}
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedWarehouse(w);
                                        console.log(w, "selected-warehouse");
                                        onAirportSelect?.(w)
                                        onAirportClick?.(w.id);
                                    }}
                                />
                            </Popover>
                        );
                    })}
                </g>
            </svg>





            {/* {regionSelection && (
                selectedRegion != null && (
                    <div
                        className="absolute inset-0 z-99 flex items-center justify-center"
                        style={{ background: "rgb(0, 0, 0)" }}
                    >
                        <button
                            onClick={() => setSelectedRegion(null)}
                            className="absolute bottom-2 right-2 text-6xl z-999999"
                        >
                            &times;
                        </button>
                        <div
                            className="relative bg-transparent rounded overflow-hidden"
                            style={{ width: "65vw", height: "65vh" }}
                        >

                            <svg
                                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                                width="100%"
                                height="100%"
                            >
                                <g
                                    transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
                                    style={{ transition: "transform 0.4s ease" }}
                                >
                                    <g id="overlay-region">
                                        {Object.entries(UZB_REGIONS_MAPS)
                                            .filter(([rid]) => Number(rid) === selectedRegion)
                                            .map(([rid, RegionPath]) => (
                                                <RegionPath
                                                    key={rid}
                                                    isActive
                                                    ref={overlayPathRef}
                                                    style={{
                                                        fill: "#ffd54f",
                                                        stroke: "#ffca28",
                                                        strokeWidth: 0.3,
                                                    }}
                                                />
                                            ))}
                                    </g>

                                    <g id="overlay-warehouses">
                                        {(byRegion[selectedRegion] || []).map((w) => {
                                            const [x, y] = projection([w.longitude, w.latitude]) as [number, number];
                                            return (
                                                <Popover
                                                    key={w.id}
                                                    content={w.name}
                                                    placement="right"
                                                    mouseEnterDelay={0.3}
                                                >
                                                    <circle
                                                        cx={x}
                                                        cy={y}
                                                        r={0.2}
                                                        fill={selectedWarehouse?.id == w.id ? "#00c932" : "#d32f2f"}

                                                        stroke="#fff"
                                                        strokeWidth={0.1}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedWarehouse(w);
                                                            console.log(w, "selected-warehouse");
                                                            onWarehouseSelect?.(w)
                                                            onWarehouseClick?.(w.id);
                                                        }}
                                                    />
                                                </Popover>
                                            );
                                        })}
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                )

            )} */}
        </div>
    );
}
