"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

import React from "react";
import PdfCard from "./pdf-card";

const PdfList = () => {
  const router = useRouter();

  const [pdfs, setPdfs]: any[] = useState([]);

  const getPdfs = async () => {
    const { data, error } = await supabase.from("resources").select("*");

    if (data) {
      setPdfs(data);
    }
  };

  useEffect(() => {
    getPdfs();
  }, []);

  const handleClick = (id: string) => {
    router.push("pdf/" + id);
  };

  return (
    <div className="grid grid-cols-5 grid-flow-row">
      {pdfs.map((pdf: any, index: number) => (
        <PdfCard pdf={pdf} key={index} />
      ))}
    </div>
  );
};

export default PdfList;
