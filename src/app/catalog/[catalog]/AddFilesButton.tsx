"use client";

import { useUploadFile } from "@/hooks/useUploadFile";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState, useCallback } from "react";

export default function AddFileButton({ catalog }: { catalog: string }) {
  const filesInputRef = useRef<HTMLInputElement>(null);
  const types = ["audio", "video", "image", "other"];
  const [isLoading, setIsLoading] = useState(false);
  const uploadFile = useUploadFile(catalog);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true);
      try {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await uploadFile(file);
        }
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
      window.location.reload();
    },
    [uploadFile]
  );
  return (
    <button
      className="btn bg-black text-white"
      onClick={() => !isLoading && filesInputRef.current?.click()}
    >
      <input
        type="file"
        accept={types.includes(catalog) ? `${catalog}/*` : "*"}
        hidden
        ref={filesInputRef}
        name="files"
        id="files-input"
        multiple
        onChange={handleUpload}
      />
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          <DocumentPlusIcon className="h-[1em] w-[1em] inline" /> Add File
        </>
      )}
    </button>
  );
}
