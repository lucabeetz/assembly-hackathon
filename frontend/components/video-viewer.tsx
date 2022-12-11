import { timeStamp } from "console";
import { useState, useRef, useEffect, useCallback } from "react";

import ReactPlayer from "react-player";
import supabase from "../utils/supabase";

type Paragraph = {
  text: string;
  start: number;
  end: number;
};

const VideoViewer = ({ videoUrl, paragraphId, videoId }: any) => {
  const [playing, setPlaying] = useState(false);

  const [transcription, setTranscription] = useState([]);
  const [paragraphTimestamps, setParagraphTimestamps] = useState([]);
  const [videoReady, setVideoReady] = useState(false);

  const [highlightedParagraph, setHighlightedParagraph] = useState<HTMLElement | null>(null);

  const ref = useRef<ReactPlayer>(null);

  useEffect(() => {
    const loadTranscription = async () => {
      const { data, error } = await supabase.storage
        .from("public")
        .download(`${videoId}.json`);

      const body = JSON.parse(await data!.text());

      if (body) {
        setTranscription(body.paragraphs);

        seekVideo(body.paragraphs[paragraphId]['start'] / 1000, paragraphId);

        const timestamps = body.paragraphs.map((paragraph: any) => [
          paragraph.start / 1000,
          paragraph.end / 1000,
        ]);
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
    changeHighlightedParagraph(progress.playedSeconds);
  };

  const seekVideo = (seconds: number, paragraph_id: number) => {
    ref.current?.seekTo(seconds, 'seconds');

    const paragraph = document.getElementById(`paragraph-${paragraph_id}`);
    paragraph?.scrollIntoView({ behavior: 'smooth' });
    setPlaying(true);
  };

  const changeHighlightedParagraph = (currentTimestamp: number) => {
    const currentParagraph = paragraphTimestamps.findIndex(
      (timestamp: number[]) =>
        timestamp[0] <= currentTimestamp && currentTimestamp < timestamp[1]
    );

    if (currentParagraph === -1)
      highlightedParagraph?.classList.remove("underline");
    else {
      const paragraph = document.getElementById(
        `paragraph-${currentParagraph}`
      );
      if (paragraph === highlightedParagraph) return;

      highlightedParagraph?.classList.remove("underline");
      paragraph?.scrollIntoView({ behavior: "smooth" });
      paragraph?.classList.add("underline");

      setHighlightedParagraph(paragraph);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-col w-full h-3/4 items-center">
        <ReactPlayer
          width="100%"
          height="90%"
          ref={ref}
          playing={playing}
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
          onProgress={handleProgress}
          onReady={() => setVideoReady(true)}
          controls
          url={videoUrl}
        />
      </div>

      <div className='h-full overflow-auto'>
        {transcription.map((paragraph: any, index: number) => (
          <div
            id={`paragraph-${index}`}
            key={index}
            className="mt-2"
            onClick={() => seekVideo(paragraph.start / 1000, index)}>
            <p>{paragraph.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoViewer;
