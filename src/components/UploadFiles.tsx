"use client";

import { useUploadFile } from "@/hooks/useUploadFile";
import { useState, useRef, useCallback } from "react";

function FilePreview({ file }: { file: File }) {
  return (
    <div className="relative w-full pt-[calc(100%_*_3/4)]">
      <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></span>
      <div className="p-8 absolute top-0 h-full w-full flex justify-between items-center flex-col">
        <div className="w-full flex justify-center">
          {/* Paper file icon */}
          <svg
            className="w-1/3 h-1/3 text-white shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            stroke="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h14a1 1 0 001-1V5a1 1 0 00-1-1H3zm4 2a1 1 0 011-1h6a1 1 0 011 1v1H7V6zm-1 4a1 1 0 011-1h8a1 1 0 011 1v1H6V10z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* File name */}
        <div className="text-white">{file.name}</div>
      </div>
    </div>
  );
}

export default function UploadFiles({
  catalog,
}: {
  catalog: string | ("audio" | "video" | "image" | "other");
}) {
  const [files, setFiles] = useState<File[] | null>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);
  const types = ["audio", "video", "image", "other"];
  const uploadFile = useUploadFile(catalog);

  const handleUpload = useCallback(async () => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await uploadFile(file);
    }
    setFiles(null);
  }, [files, uploadFile]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("Fired handleImageUpload");
    const files_ = e.target.files;
    const files__ = files ? [...files] : [];
    if (files_) {
      // Add new selected files if they weren't already selected
      for (let i = 0; i < files_.length; i++) {
        const file = files_.item(i);
        if (file && !files__.some((f) => f.name === file.name)) {
          files__.push(file!);
        }
      }
    }
    setFiles(files__);
  }
  return (
    <>
      <div className="mt-4 w-full">
        <input
          type="file"
          accept={types.includes(catalog) ? `${catalog}/*` : "*"}
          hidden
          ref={filesInputRef}
          name="post_media"
          id="post-media"
          multiple
          onChange={handleImageUpload}
        />
        {!files || files.length === 0 ? (
          <button
            type="button"
            className="btn"
            onClick={() => filesInputRef.current?.click()}
          >
            Add File
          </button>
        ) : (
          <div
            id="preview"
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8"
          >
            {files &&
              files.map((file, index) => (
                <FilePreview key={index} file={file} />
              ))}
            <button
              className="btn"
              type="button"
              onClick={() => filesInputRef.current?.click()}
            >
              Add File
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 w-full">
        <button className="btn" type="button" onClick={handleUpload}>
          Upload Files
        </button>
      </div>
    </>
  );
}
