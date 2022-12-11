import { useState, useRef, useEffect } from 'react';

import ReactPlayer from 'react-player'
import supabase from '../utils/supabase';

const VideoViewer = ({ videoUrl, paragraphId, videoId }: any) => {
  const [playing, setPlaying] = useState(false);

  const [transcription, setTranscription] = useState([]);
  const [paragraphTimestamps, setParagraphTimestamps] = useState([]);

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
        console.log(body.paragraphs);
        console.log(paragraphId);

        // seekVideo(transcription[paragraphId]['start'] / 1000, paragraphId);

        const timestamps = body.paragraphs.map((paragraph: any) => paragraph.start / 1000);
        setParagraphTimestamps(timestamps);
      }
    };

    loadTranscription();
  }, [videoId]);

  useEffect(() => {
    console.log(transcription[paragraphId]);
    
    if (transcription.length > 0) {
      seekVideo(transcription[paragraphId]['start'] / 1000, paragraphId);
    }
  }, [paragraphId]);

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
          onReady={() => seekVideo(transcription[paragraphId]['start'] / 1000, paragraphId)}
          controls
          url={videoUrl} />
      </div>
      <div className='h-1/4 overflow-auto p-4'>
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

