'use client';

import { useState } from 'react';

const VideoInput = () => {
  const [videoUrl, setVideoUrl] = useState('');

  const transcribeVideo = () => {
    console.log(`Send video to server for transcription: ${videoUrl}`);
  };

  return (
    <div>
      <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="Video url" />
      <button onClick={transcribeVideo}>Transcribe</button>
    </div>
  );
};

export default VideoInput;