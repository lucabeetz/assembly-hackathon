"use client";

import { Avatar, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

import React from "react";

const VideoCard = (video: any) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("video/" + video.video.id);
  };

  return (
    <div className="m-2 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      <a href="#">
        <img className="" src={video.video.thumbnail} alt="" />
      </a>
      <div className="p-4">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {video.video.title}
          </h5>
        </a>
      </div>
    </div>
  );
};

export default VideoCard;
