import React, {useEffect, useState} from 'react';

import NavBar from "./components/navbar";
import InfoCard from "./components/info-card";
import Map from "./components/map";

import config from "./config";

import {Node, ApiResponse} from "./types";

const loadData = (): Promise<ApiResponse> => fetch(config.api).then(r => r.json());

function App() {
    const [loading, setLoading] = useState<boolean>(true);
    const [network, setNetwork] = useState<string>("")
    const [nodes, setNodes] = useState<Node[]>([]);

    const load = () => {
        loadData().then(r => {
            setNetwork(r.network);
            setNodes(r.nodes);
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        load()
        const interval = setInterval(load, 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <NavBar/>;
    }

    return <>
        <NavBar/>
        <InfoCard network={network} nodes={nodes}/>
        <Map nodes={nodes}/>
    </>
}

export default App;
