'use client';

import { Spinner } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EPubViewer from '../../../components/epub-viewer';
import supabase from '../../../utils/supabase';

const EPub = ({ params }) => {
    const searchParams = useSearchParams();

    const [epub, setEPub] = useState(null);

    const getVideos = async () => {
        const { data, error } = await supabase.from('epubs').select('*').eq('id', params.id);

        if (data && data.length == 1) {
            setEPub(data[0]);
            console.log(data[0]);
        }
    };

    // useEffect(() => {
    //     getVideos();
    // }, []);

    setEPub([{ url: "/lemon.epub" }])

    if (!epub) {
        return <Spinner />
    }

    const locationID = searchParams.get('locationID');

    return (
        <div>
            <EPubViewer url={epub.url} highlightedLocationID={locationID} />
        </div>
    );
}

export default EPub;