'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const VideoViewer = dynamic(() => import('../../components/video-viewer'), { ssr: false });

const Video = () => {
  const router = useRouter()
  const { id } = router.query

  return <p>Post: {id}</p>
  // return (
  //   <div>
  //     <VideoViewer />
  //   </div>
  // );
}

export default Video;