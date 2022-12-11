"use client";

import { Avatar, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

import React from "react";
import VideoCard from "./video-card";

const VideoList = () => {
  const router = useRouter();

  const [videos, setVideos]: any[] = useState([]);

  const getVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*");

    if (data) {
      setVideos(data);
    }
  };

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <div className="grid grid-cols-5 grid-flow-row">
      {videos.map((video: any, index: number) => (
        <VideoCard
          video={video}
          key={index}
        />
      ))}
    </div>
  );
};

export default VideoList;
