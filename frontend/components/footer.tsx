'use client';

import { Footer } from "flowbite-react";

const VerbelFooter = () => {
    return (
        <Footer container={true} className="fixed bottom-0" >
            <Footer.Copyright
                href="#"
                by="Verbel"
                year={2022}
            />
            <Footer.LinkGroup>
                <Footer.Link href="#">
                    About
                </Footer.Link>
                <Footer.Link href="#">
                    Privacy Policy
                </Footer.Link>
                <Footer.Link href="#">
                    Licensing
                </Footer.Link>
                <Footer.Link href="#">
                    Contact
                </Footer.Link>
            </Footer.LinkGroup>
        </Footer>
    )
}

export default VerbelFooter;