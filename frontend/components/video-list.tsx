'use client';

import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const VideoList = () => {
  const [videos, setVideos] = useState([]);

  const getVideos = async () => {
    const { data, error } = await supabase.from('videos').select('*');

    if (data) {
      setVideos(data);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div>
      {videos.map((video, index): any => (
        <div key={index}>
          <p>Title: {video.title}</p>
        </div>
      ))}
    </div>
  );
}

export default VideoList;