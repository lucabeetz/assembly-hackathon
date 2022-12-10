import { timeStamp } from 'console';
import { useState, useRef, useEffect, useCallback } from 'react';

import ReactPlayer from 'react-player'
import supabase from '../utils/supabase';

type Paragraph = {
  text: string;
  start: number;
  end: number;
};

const VideoViewer = ({ video_url, id, initialTimestamp }) => {
  const [playing, setPlaying] = useState(false);

  const [transcription, setTranscription] = useState<Paragraph[]>([]);
  const [paragraphTimestamps, setParagraphTimestamps] = useState<number[][]>([]);
  const [highlightedParagraph, setHighlightedParagraph] = useState<HTMLElement | null>(null);

  const ref = useRef<ReactPlayer>(null);

  useEffect(() => {
    const loadTranscription = async () => {
      const res = await fetch(`https://ctejpbhbokuzzivioffl.supabase.co/storage/v1/object/public/public/${id}.json`)
      const body = await res.json();

      if (body) {
        setTranscription(body.paragraphs);
        console.log(body.paragraphs);


        const timestamps = body.paragraphs.map((paragraph: any) => [paragraph.start / 1000, paragraph.end / 1000]);
        setParagraphTimestamps(timestamps);
      }
    };

    loadTranscription();

    console.log('initialTimestamp', initialTimestamp);

    if (initialTimestamp) {
      ref.current?.seekTo(initialTimestamp, 'seconds');
    }
  }, []);

  const handleProgress = (progress: any) => {
    changeHighlightedParagraph(progress.playedSeconds)
  };

  const seekVideo = (seconds: number, paragraph_id: number) => {
    setPlaying(true);
    ref.current?.seekTo(seconds, 'seconds');
    changeHighlightedParagraph(seconds);
  };

  const changeHighlightedParagraph = (currentTimestamp: number) => {
    const currentParagraph = paragraphTimestamps.findIndex((timestamp: number[]) => timestamp[0] <= currentTimestamp && currentTimestamp < timestamp[1]);

    if (currentParagraph === -1)
      highlightedParagraph?.classList.remove('underline');
    else {
      const paragraph = document.getElementById(`paragraph-${currentParagraph}`);
      if (paragraph === highlightedParagraph) return;

      highlightedParagraph?.classList.remove('underline');
      paragraph?.scrollIntoView({ behavior: 'smooth' });
      paragraph?.classList.add('underline');
      
      setHighlightedParagraph(paragraph);
    }
  }

  const onReady = useCallback(() => {
    if (initialTimestamp) {
      ref.current?.seekTo(initialTimestamp, 'seconds');
      changeHighlightedParagraph(initialTimestamp);
    }
  }, [ref.current, initialTimestamp]);

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
          url={video_url}
          onReady={onReady}
        />
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
