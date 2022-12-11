'use client';

import { Spinner } from 'flowbite-react';
import dynamic from 'next/dynamic';
import {  useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
const VideoViewer = dynamic(() => import('../../../components/video-viewer'), { ssr: false });

const Video = ({ params }) => {
  const searchParams = useSearchParams();

  const [video, setVideo] = useState(null);

  const getVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('id', params.id);

    if (data && data.length == 1) {
      setVideo(data[0]);
      console.log(data[0]);
      
    }
  };

  useEffect(() => {
    getVideos();
  }, []);


  if (!video) {
    return <Spinner aria-label="Default status example" />
  }

  const initialTimestamp = searchParams.get('t');

  return (
    <div>
      <VideoViewer video_url={video.video_url} id={video.id} initialTimestamp={initialTimestamp} />
    </div>
  );
}

export default Video;