'use client';

import { useEffect, useRef, useState } from "react";
import { ReactEpubViewer } from "react-epub-viewer";
import { ReactReader } from "react-reader";

import { useRouter } from 'next/router'



const EPubViewer = ({ url }) => {

    // const router = useRouter()
    // const { highlight } = router.query

    const [location, setLocation] = useState<string | null>(null)
    const locationChanged = (epubcifi: string) => {
        // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
        setLocation(epubcifi)
        console.log(epubcifi)

    }

    // useEffect(() => {
    //     if (highlight) {
    //         const paragraph = document.getElementById(`paragraph-${currentParagraph}`);
    //     }
    // }, [highlight])

    return (
        <div style={{ height: '100vh' }}>
            <ReactReader
                location={location}
                locationChanged={locationChanged}
                url="/lemon.epub"
                showToc={false}
            />
        </div>
    );
};

export default EPubViewer;