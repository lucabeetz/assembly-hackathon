import { useState, useRef, useEffect } from 'react';

import ReactPlayer from 'react-player'
import supabase from '../utils/supabase';

const VideoViewer = ({ videoUrl, paragraphId, videoId }: any) => {
  const [playing, setPlaying] = useState(false);

  const [transcription, setTranscription] = useState([]);
  const [paragraphTimestamps, setParagraphTimestamps] = useState([]);
  const [videoReady, setVideoReady] = useState(false);

  const ref = useRef<ReactPlayer>(null);

  useEffect(() => {
    const loadTranscription = async () => {
      const { data, error } = await supabase
        .storage
        .from('public')
        .download(`${videoId}.json`);

      const body = JSON.parse(await data!.text());

      if (body) {
        setTranscription(body.paragraphs);

        seekVideo(body.paragraphs[paragraphId]['start'] / 1000, paragraphId);

        const timestamps = body.paragraphs.map((paragraph: any) => paragraph.start / 1000);
        setParagraphTimestamps(timestamps);
      }
    };

    loadTranscription();
  }, [videoId]);

  useEffect(() => {
    if (transcription.length > 0) {
      if (transcription[paragraphId]) {
        seekVideo(transcription[paragraphId]['start'] / 1000, paragraphId); 
      }
    }
  }, [paragraphId, transcription, videoReady]);

  const handleProgress = (progress: any) => {
    const currentParagraph = paragraphTimestamps.findIndex((timestamp: number) => progress.playedSeconds < timestamp) - 1;

    if (currentParagraph > 0) {
      const paragraph = document.getElementById(`paragraph-${currentParagraph}`);
      paragraph?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const seekVideo = (seconds: number, paragraph_id: number) => {
    ref.current?.seekTo(seconds, 'seconds');

    const paragraph = document.getElementById(`paragraph-${paragraph_id}`);
    paragraph?.scrollIntoView({ behavior: 'smooth' });
    setPlaying(true);
  };

  return (
    <div className='flex flex-col items-center h-screen'>
      <div className='flex flex-col w-full h-full items-center'>
        <ReactPlayer
          width='100%'
          height='90%'
          ref={ref}
          playing={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onProgress={handleProgress}
          onReady={() => setVideoReady(true)}
          controls
          url={videoUrl} />
      </div>
      <div className='h-full overflow-auto'>
        {transcription.map((paragraph: any, index: number) => (
          <div id={`paragraph-${index}`} key={index} className='mt-2' onClick={() => seekVideo(paragraph.start / 1000, index)}>
            <p>{paragraph.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoViewer;

