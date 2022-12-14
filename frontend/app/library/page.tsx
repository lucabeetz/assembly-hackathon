"use client";

import { Tabs } from "flowbite-react";
import { useState } from "react";
import PdfList from "../../components/pdf/pdf-list";
import VideoList from "../../components/video/video-list";

const Library = () => {
  const [selected, setSelected] = useState("video");

  return (
    <div className="container mx-auto px-4">
      <Tabs.Group aria-label="Tabs with underline" style="underline">
        <Tabs.Item
          title="Video"
          active={selected == "video"}
          onClick={() => setSelected("video")}
        >
          <VideoList />
        </Tabs.Item>
        <Tabs.Item
          title="PDF"
          active={selected == "pdf"}
          onClick={() => setSelected("pdf")}
        >
          <PdfList />
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
};

export default Library;
