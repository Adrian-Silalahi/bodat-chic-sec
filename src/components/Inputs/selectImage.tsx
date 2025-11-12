/* eslint-disable react/prop-types */
"use client";

import React, { useCallback, useState } from "react";
import { type VariationRequestType } from "@/src/types";
import { useDropzone } from "react-dropzone";
import CustomButton from "../CustomButton";

interface SelectImageProps {
  images?: File[];
  handleFileChange: (value: File[]) => void;
}

const SelectImage: React.FC<SelectImageProps> = ({
  handleFileChange,
  images,
}) => {
  const hasImages = images && images.length > 0;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileChange(acceptedFiles);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
  });

  const clearImage = () => {
    handleFileChange([]);
  };
  return (
    <div className="flex flex-col gap-2 ">
      <div className="mb-2 font-semibold">Put product image </div>
      <div
        {...getRootProps()}
        className="border-2 border-slate-400 p-5 border-dashed cursor-pointer text-sm font-normal text-slate-400 flex imageInfos-center justify-center"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here...</p>
        ) : hasImages ? (
          <div className="text-slate-600 text-left">
            <p className="font-semibold">Selected Files:</p>
            <ul className="list-disc list-inside ml-2">
              {images.map((image, index) => (
                <li key={index} className="text-xs truncate">
                  {image.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Choose Image</p>
        )}
      </div>
      {hasImages && (
        <div className="w-70px mt-2">
          <CustomButton
            label="Cancel"
            small
            outline
            onClick={() => {
              clearImage();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectImage;
