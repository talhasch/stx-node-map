import React, {Fragment} from 'react';

import {Map, Marker, Popup, TileLayer} from "react-leaflet";

import {Node} from "../../types";

import {DivIcon, DivIconOptions} from "leaflet";

const FullscreenControl = require("react-leaflet-fullscreen");

interface Props {
    nodes: Node[];
}

const NodeMap = (props: Props) => {
    const {nodes} = props;

    const center = {lat: 20.00, lng: 12.00};

    const publicCount = nodes.filter(x => x.location).length;

    const iconProps: DivIconOptions = {
        className: "map-marker-icon",
        iconSize: [24, 34],
        iconAnchor: [12, 34],
        popupAnchor: [0, -20],
        html: "<img alt='Marker' src='/marker.png' />"
    }
    const icon = new DivIcon(iconProps);

    return <div className="node-map">
        <div className="title">{publicCount} public stacks node</div>
        <Map center={center} zoom={1} className="the-map">
            <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {nodes.map((node, i) => {
                if (!node.location) {
                    return null;
                }

                // Search for nodes on same location
                const rNodes = nodes.filter(x => x.location && (x.location.lng === node.location!.lng && x.location.lat === node.location!.lat));

                return <Marker icon={icon} key={i} position={{lat: node.location.lat, lng: node.location.lng}}>
                    <Popup className="map-popup-content">
                        {rNodes.map((x, i) => {
                            if (!x.location) {
                                return null;
                            }

                            const {location, address} = x;
                            const {country, city} = location;
                            const href = `http://${address}:20443/v2/info`;

                            return <Fragment key={i}>
                                <p><strong>{country}</strong> {city && <> - {city}</>} </p>
                                <a href={href} rel="noreferrer" target="_blank">{address}</a>
                            </Fragment>
                        })}
                    </Popup>
                </Marker>
            })}
            <FullscreenControl position="topright"/>
        </Map>
    </div>
}

export default NodeMap;
