import React from 'react';

import {Navbar, Nav} from "react-bootstrap";

import {openInNewSvg} from "../../svg";


const NavBar = () => {
    return <Navbar className="main-nav-bar" expand="md">
        <Navbar.Brand href="#home"><img
            src="/logo.png"
            alt="Logo"
            height="30"
            className="d-inline-block align-top"
        /></Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse>
            <Nav className="ml-auto">
                <Nav.Link href="https://testnet-explorer.blockstack.org" target="_blank">Stacks Explorer {openInNewSvg}</Nav.Link>
                <Nav.Link href="https://stackstoken.com" target="_blank">Stacks Token {openInNewSvg}</Nav.Link>
                <Nav.Link href="https://www.blockstack.org" target="_blank">Blockstack {openInNewSvg}</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default NavBar;
