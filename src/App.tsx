import React, {useEffect, useState} from 'react';

import {Button} from "react-bootstrap";


import {Map, TileLayer, Marker, Popup} from "react-leaflet";


import {refreshSvg} from "./svg";

interface Neighbor {
    authenticated: boolean
    ip: string
    network_id: number
    peer_version: number
    port: number
    public_key_hash: string
}

interface Neighbors {
    sample: Neighbor[],
    inbound: Neighbor[],
    outbound: Neighbor[],
}

interface Ip2Loc {
    "ip": string,
    "country_code": string,
    "country_name": string,
    "region_code": string,
    "region_name": string,
    "city": string,
    "zip_code": string,
    "time_zone": string,
    "latitude": number,
    "longitude": number,
    "metro_code": number
}

const getIPs = async (): Promise<string[]> => {
    return fetch("https://krypton.talhabulut.com/v2/neighbors")
        .then(r => r.json())
        .then((r: Neighbors) => {
            return Array.from(new Set([
                ...r.sample.map(x => x.ip),
                ...r.inbound.map(x => x.ip),
                ...r.outbound.map(x => x.ip)
            ].filter(x => x !== "0.0.0.0")));
        });
}

const ip2loc = async (ip: string): Promise<Ip2Loc> => {
    return fetch(`https://freegeoip.app/json/${ip}`)
        .then(r => r.json())
}


function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [locations, setLocations] = useState<Ip2Loc[]>([]);

    const load = () => {
        setLoading(true);
        setTimeout(() => {
            getIPs()
                .then(ips => Promise.all(ips.map(item => ip2loc(item))))
                .then(r => setLocations(r))
                .finally(() => setLoading(false));
        }, 500);

    }

    useEffect(() => {
        load();
    }, []);

    const center = {lat: 31.579396, lng: 13.686786};
    const MyMap = <Map center={center} zoom={2} id="the-map">
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((x, i) => {
            return <Marker position={{lat: x.latitude, lng: x.longitude}}>
                <Popup>
                    {x.country_name} -  {x.city} <br />
                    {x.ip}
                </Popup>
            </Marker>
        })}
    </Map>;

    return (
        <div className="wrapper">
            <div className="map">{MyMap}</div>
            <div className="content">
                <div className="list">
                    <div className="list-header">
                        <div> {loading ? "..." : <span>{locations.length} Nodes</span>}</div>
                        <div><Button disabled={loading} size="sm" onClick={load}>{refreshSvg}</Button></div>
                    </div>
                    {locations.map((x, i) => {
                        return <div className="list-item" key={i}>
                            <div className="row-1">
                                <span className="num">{i + 1}</span>
                                <span className="ip">{x.ip}</span>
                            </div>
                            <div className="row-2">
                                <span className="country">{x.country_name || "unknown"}</span>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
