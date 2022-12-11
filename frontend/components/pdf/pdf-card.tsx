"use client";

import { useRouter } from "next/navigation";

import React from "react";

const PdfCard = (pdf: any) => {
  pdf = pdf.pdf;
  const router = useRouter();

  const handleClick = () => {
    router.push("pdf/" + pdf.id);
  };

  console.log(pdf);
  return (
    <div
      className="m-2 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
      onClick={() => handleClick()}
    >
      <div className="p-4">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {pdf.title}
          </h5>
        </a>
      </div>
    </div>
  );
};

export default PdfCard;
