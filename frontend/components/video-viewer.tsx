import { useState, useRef } from 'react';

import ReactPlayer from 'react-player'

const VideoViewer = () => {
  const [playing, setPlaying] = useState(false);

  const ref = useRef<ReactPlayer>(null);

  const handlePlay = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress: any) => {
    console.log(progress);
  };

  return (
    <div>
      <div>
        <ReactPlayer
          ref={ref}
          playing={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onProgress={handleProgress}
          url={'https://www.youtube.com/watch?v=YoXxevp1WRQ'} />

        <div onClick={handlePlay}>
          {playing ? 'Pause' : 'Play'}
        </div>
      </div>
    </div>
  );
};

export default VideoViewer;

