"use client";

import { useState } from "react";
import supabase from "../utils/supabase";
import VideoViewer from "./video-viewer";
import Library from "../app/library/page";
import LoadingSpinner from "./loading_spinner";

const QueryView = () => {
  const [query, setQuery] = useState("");
  const [results, setResults]: any[] = useState([]);

  const [timestamp, setTimestamp] = useState(0);

  const [selectedResult, setSelectedResult] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const runQuery = async (e: any) => {
    e.preventDefault();

    console.log("Running query: " + query);

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("query", {
        body: { query: query },
      });

      console.log(data);

      // Get information for each query result
      const displayResults: any[] = [];

      for (const result of data) {
        const { data, error } = await supabase
          .from("videos")
          .select("title, video_url")
          .eq("id", result["resource_id"]);

        displayResults.push({
          title: data![0]["title"],
          video_url: data![0]["video_url"],
          paragraph_id: result["paragraph_id"],
          score: result["score"],
          text: result["text"],
          video_id: result["resource_id"],
        });
      }

      setResults(() => displayResults);
      console.log(displayResults);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  return (
    <div className="flex-col w-screen">
      <div className="flex my-8 items-center justify-center">
        <form className="flex items-center w-1/2 justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              setResults([]);
              setSelectedResult(null);
            }}
            className="p-2.5 mr-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Clear
          </button>
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
              onKeyDown={(e) => hanleEnter(e)}
              required
            />
          </div>
          {isLoading && (
            <div className="ml-2">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && (
            <button
              type="submit"
              onClick={(e) => runQuery(e)}
              className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
          )}
        </form>
      </div>
      {results.length == 0 && <Library />}
      <div className="flex">
        <div className="h-full w-1/2 overflow-auto px-4">
          {results.map((result: any, index: number) => (
            <div
              key={index}
              className="mb-2 cursor-pointer"
              onClick={() => setSelectedResult(result)}
            >
              <p className="font-semibold">{result["title"]}</p>
              <p className="text-sm text-slate-500">{result["text"]}</p>
              <p className="text-sm text-slate-500 font-semibold">
                Score: {result["score"]}
              </p>
            </div>
          ))}
        </div>

        <div className="w-1/2">
          {selectedResult && (
            <VideoViewer
              videoUrl={selectedResult["video_url"]}
              videoId={selectedResult["video_id"]}
              paragraphId={selectedResult["paragraph_id"]}
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-1/2 h-screen">
        <form className="flex w-full p-4">
          <input
            className="w-full mr-4"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query"
          />
          <button type="submit" onClick={(e) => runQuery(e)}>
            Search
          </button>
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
