import React, {useEffect, useState} from 'react';

import {Button} from "react-bootstrap";

import {Map, TileLayer, Marker, Popup} from "react-leaflet";

import {refreshSvg} from "./svg";

import config from "./config";

interface Node {
    address: string;
    location?: {
        lat: number;
        lng: number;
        country: string;
        city: string;
    }
}

interface Resp {
    network: string;
    nodes: Node[]
}

const load = (): Promise<Resp> => {
    return fetch(config.api).then(r => r.json())
}

function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [network, setNetwork] = useState<string>("")
    const [nodes, setNodes] = useState<Node[]>([]);


    useEffect(() => {
        load()
            .then(r => {
                setNetwork(r.network);
                setNodes(r.nodes);
            })
            .finally(() => setLoading(false))
    }, []);

    const center = {lat: 31.579396, lng: 13.686786};
    const MyMap = <Map center={center} zoom={2} id="the-map">
        <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {nodes.map((x, i) => {
            if (!x.location) {
                return null;
            }
            return <Marker position={{lat: x.location.lat, lng: x.location.lng}}>
                <Popup>
                    {x.location.country} - {x.location.city} <br/>
                    {x.address}
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
                        <div> {loading ? "..." : <span>{nodes.length} Nodes</span>}</div>
                        <div><Button disabled={loading} size="sm" onClick={load}>{refreshSvg}</Button></div>
                    </div>
                    {nodes.map((x, i) => {
                        const nodeLink = `http://${x.address}:20443/v2/info`
                        return <div className="list-item" key={i}>
                            <div className="row-1">
                                <span className="num">{i + 1}</span>
                                <span className="ip">
                                    {x.location && <a href={nodeLink} target="_blank" rel="noreferrer">{x.address}</a>}
                                    {!x.location && <span>{x.address}</span>}
                                </span>
                            </div>
                            {x.location && (
                                <div className="row-2">
                                    <span className="country">{x.location.country}</span>
                                </div>
                            )}
                        </div>
                    })}
                </div>
            </div>
        </div>
    );
}

export default App;
