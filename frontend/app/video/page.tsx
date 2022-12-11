'use client';

import dynamic from 'next/dynamic';
const VideoViewer = dynamic(() => import('../../components/video-viewer'), { ssr: false });

const Video = () => {
  return (
    <div>
      {/* <VideoViewer /> */}
    </div>
  );
}

export default Video;