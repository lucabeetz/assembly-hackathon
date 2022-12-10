import { useState, useRef, useEffect } from 'react';

import ReactPlayer from 'react-player'
import supabase from '../utils/supabase';

const VideoViewer = () => {
  const [playing, setPlaying] = useState(false);

  const [transcription, setTranscription] = useState([]);
  const [paragraphTimestamps, setParagraphTimestamps] = useState([]);

  const ref = useRef<ReactPlayer>(null);

  useEffect(() => {
    const loadTranscription = async () => {
      const res = await fetch('https://ctejpbhbokuzzivioffl.supabase.co/storage/v1/object/public/transcriptions/paragraphs.json')
      const body = await res.json();

      if (body) {
        setTranscription(body.paragraphs);

        const timestamps = body.paragraphs.map((paragraph: any) => paragraph.start / 1000);
        setParagraphTimestamps(timestamps);
      }
    };

    loadTranscription();
  }, []);

  const handlePlay = () => {
    setPlaying(!playing);
  };

  const handleProgress = (progress: any) => {
    const currentParagraph = paragraphTimestamps.findIndex((timestamp: number) => progress.playedSeconds < timestamp) - 1;

    if (currentParagraph > 0) {
      const paragraph = document.getElementById(`paragraph-${currentParagraph}`);
      paragraph?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const seekVideo = (seconds: number, paragraph_id: number) => {
    setPlaying(true);
    ref.current?.seekTo(seconds, 'seconds');

    const paragraph = document.getElementById(`paragraph-${paragraph_id}`);
    paragraph?.scrollIntoView({ behavior: 'smooth' });
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
          controls
          url={'https://www.youtube.com/watch?v=YoXxevp1WRQ'} />

        <div onClick={handlePlay}>
          {playing ? 'Pause' : 'Play'}
        </div>
      </div>
      <div className='w-1/2 h-1/4 overflow-auto'>
        {transcription.map((paragraph, index) => (
          <div id={`paragraph-${index}`} key={index} className='mt-2' onClick={() => seekVideo(paragraph.start / 1000, index)}>
            <p>{paragraph.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoViewer;
