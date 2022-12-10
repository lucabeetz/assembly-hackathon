'use client';

import { useState } from "react";

const QueryView = () => {
  const [query, setQuery] = useState('');

  const runQuery = () => {

  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/2">
        <div className="flex w-full">
          <input className="w-full mr-4" type="text" onChange={(e) => setQuery(e.target.value)} placeholder="Query" />
          <button onClick={runQuery}>Ask</button>
        </div> 
      </div>
    </div>
  );
};

export default QueryView;