import React from 'react';

import CountUp from "react-countup";

import {Node} from "../../types";

interface Props {
    network: string;
    nodes: Node[];
}

const InfoCard = (props: Props) => {
    const {network} = props;
    const count = props.nodes.length;

    return <div className="info-card">
        <div className="card-content">
            <div className="node-count">
                <CountUp start={1} end={count} duration={3}/>
            </div>
            <div>online</div>
            <div>stacks nodes</div>
            <div className={`network ${network}`}>
            <div className="network-label">{network}</div>
            </div>
        </div>
    </div>
}

export default InfoCard;
