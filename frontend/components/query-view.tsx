'use client';

import { useState } from "react";
import supabase from "../utils/supabase";
import VideoViewer from "./video-viewer";

const QueryView = () => {

  const [query, setQuery] = useState('');
  const [results, setResults]: any[] = useState([]);

  const [timestamp, setTimestamp] = useState(0);

  const [selectedResult, setSelectedResult] = useState(null);

  const runQuery = async (e: any) => {
    e.preventDefault();

    console.log('Running query: ' + query);
    const { data, error } = await supabase.functions.invoke('query', {
      body: { query: query }
    });

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);

    // Get information for each query result
    const displayResults: any[] = [];

    for (const result of data) {
      if (result['content_type'] !== 'video') {
        if (result['resource_id'].length < 4) {
          continue;
        }

        const { data, error } = await supabase
          .from('resources')
          .select('title')
          .eq('id', result['resource_id']);

        // Get public url for PDF
        const { data: { publicUrl } } = await supabase
          .storage
          .from('public')
          .getPublicUrl(`${result['resource_id']}.pdf`);
        console.log(publicUrl);

        displayResults.push({
          'title': data![0]['title'],
          'paragraph_id': result['paragraph_id'],
          'score': result['score'],
          'text': result['text'],
          'video_id': result['resource_id'],
          'type': result['content_type'],
          'pdf_url': publicUrl,
        });
      } else {
        const { data, error } = await supabase
          .from('videos')
          .select('title, video_url')
          .eq('id', result['resource_id']);

        displayResults.push({
          'title': data![0]['title'],
          'video_url': data![0]['video_url'],
          'paragraph_id': result['paragraph_id'],
          'score': result['score'],
          'text': result['text'],
          'video_id': result['resource_id'],
          'type': result['content_type']
        });


      }
    }

    setResults(() => displayResults);
    console.log(displayResults);
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/2 h-screen">
        <form className="flex w-full p-4">
          <input className="w-full mr-4" type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Query" />
          <button type="submit" onClick={(e) => runQuery(e)}>Search</button>
        </form> 

        <div className="h-full overflow-auto px-4" onClick={() => setTimestamp(Date.now())}>
          {results.map((result: any, index: number) => (
            <div key={index} className="mb-2 cursor-pointer" onClick={() => setSelectedResult(result)}>
              <p className="font-semibold">{result['title']}</p>

              {result['type'] === 'pdf' && <p className="text-sm text-slate-500">Page {result['paragraph_id']}</p>}
              {result['type'] === 'video' && <p className="text-sm text-slate-500">{result['text']}</p>}

              <p className="text-sm text-slate-500 font-semibold">Score: {result['score']}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-1/2">
        {(selectedResult && selectedResult['type'] == 'video') && <VideoViewer key={timestamp} videoUrl={selectedResult['video_url']} videoId={selectedResult['video_id']} paragraphId={selectedResult['paragraph_id']} /> }

        {(selectedResult && selectedResult['type'] == 'pdf') && (
          <iframe
            className="w-full h-full"
            src={`${selectedResult['pdf_url']}#page=${selectedResult['paragraph_id']+1}`}
            key={timestamp} />
        )}
      </div>
    </div>
  );
};

export default QueryView;