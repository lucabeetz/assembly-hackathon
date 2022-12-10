'use client';

import { useState } from "react";
import supabase from "../utils/supabase";

const QueryView = () => {
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState([]);

  const runQuery = async () => {
    const { data, error } = await supabase.functions.invoke('query', {
      body: { query: query }
    });

    if (error) {
      console.log(error);
    }

    if (data) {
      setQueryResult(data);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/2">
        <div className="flex w-full">
          <input className="w-full mr-4" type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Query" />
          <button onClick={runQuery}>Ask</button>
        </div> 

        <div>
          {queryResult.map((result, index) => (
            <div key={index} className="mb-2">
              <p>Video: {result['video_id']}</p>
              <p>Score: {result['score']}</p>
              <p>Text: {result['text']}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryView;