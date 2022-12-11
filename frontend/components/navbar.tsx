'use client';
import { Navbar } from "flowbite-react";

import logo from '../public/logo.svg'
import Image from 'next/image'

const VerbelNavbar = () => {
    return (
        <Navbar
            fluid={true}
            rounded={true}
        >
            <Navbar.Brand href="/">
                <Image src={logo} className="mr-3 h-6 sm:h-9" alt="Verbel Logo" />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    Verbel
                </span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link
                    href="/"
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="/library">
                    Library
                </Navbar.Link>
                <Navbar.Link href="/about">
                    About
                </Navbar.Link>

            </Navbar.Collapse>
        </Navbar>
    );
};

export default VerbelNavbar;