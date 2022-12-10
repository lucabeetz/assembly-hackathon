'use client';

import { Spinner } from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
const VideoViewer = dynamic(() => import('../../../components/video-viewer'), { ssr: false });

const Video = ({ params }) => {
  const [video, setVideo] = useState(null);

  const getVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('id', params.id);

    if (data) {
      setVideo(data);
      console.log(data);
      
    }
  };

  useEffect(() => {
    getVideos();
  }, []);


  if (!video) {
    return <Spinner aria-label="Default status example" />
  }

  return (
    <div>
      <VideoViewer video_url={video[0].video_url} id={video[0].id}  />
    </div>
  );
}

export default Video;