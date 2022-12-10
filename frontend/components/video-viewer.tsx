import { useState, useRef, useEffect } from 'react';

import ReactPlayer from 'react-player'
import supabase from '../utils/supabase';

const VideoViewer = () => {
  const [playing, setPlaying] = useState(false);
  const [transcription, setTranscription] = useState([]);

  const ref = useRef<ReactPlayer>(null);

  useEffect(() => {
    console.log('Load transcription ...');

    // const loadTranscription = async () => {
    //   const { data, error } = await supabase
    //     .storage
    //     .from('public')
    //     .download('paragraphs.json');

    //   console.log(data);
    //   console.log(error);
    // };

    const loadTranscription = async () => {
      const res = await fetch('https://ctejpbhbokuzzivioffl.supabase.co/storage/v1/object/public/transcriptions/paragraphs.json')
      const body = await res.json();

      if (body) {
        setTranscription(body.paragraphs);
        console.log(body.paragraphs);
      }
    };

    loadTranscription();
  }, []);

  const handlePlay = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress: any) => {
    console.log(progress);
  };

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='flex flex-col w-full h-3/4 items-center'>
        <ReactPlayer
          width='100%'
          height='90%'
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
      <div className='w-1/2 h-1/4'>
        {transcription.map((paragraph, index) => (
          <div key={index} className='mt-2'>
            <p>{paragraph.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoViewer;

