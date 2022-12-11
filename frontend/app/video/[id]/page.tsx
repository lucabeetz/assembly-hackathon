'use client';

import { Spinner } from 'flowbite-react';
import dynamic from 'next/dynamic';
import {  useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '../../../utils/supabase';
const VideoViewer = dynamic(() => import('../../../components/video/video-viewer'), { ssr: false });

const Video = ({ params }) => {
  const searchParams = useSearchParams();

  const [video, setVideo] = useState(null);

  const getVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('id', params.id);

    if (data && data.length == 1) {
      setVideo(data[0]);
      // console.log(data[0]);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);


  if (!video) {
    return <Spinner aria-label="Default status example" />
  }

  const initialParagraphID = searchParams.get('p');

  return (
    <div>
      <VideoViewer videoUrl={video.video_url} videoId={video.id} paragraphId={initialParagraphID} />
    </div>
  );
}

export default Video;