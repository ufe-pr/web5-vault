"use client";
import useFileCallbacks from "@/hooks/useFileCallbacks";
import useGetCatalogFileNodes from "@/hooks/useGetCatalogFileNodes";
import { FileNode } from "@/types";
import { MusicalNoteIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function AudioCatalogPage() {
  const { error, fileNodes, isLoading } = useGetCatalogFileNodes("audio");

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {`${error}`}</div>}
      {fileNodes && (
        <ul>
          {fileNodes.map((fileNode) => (
            <AudioItem key={fileNode.id} fileNode={fileNode} />
          ))}
        </ul>
      )}
    </>
  );
}

function AudioItem({ fileNode }: { fileNode: FileNode }) {
  const { downloadFile, deleteFile } = useFileCallbacks(fileNode.id);

  return (
    <li className="mt-4 lg:mt-8 first-of-type:mt-0">
      <div className="flex items-center gap-4 lg:gap-8 rounded-xl p-4 bg-black text-white">
        <a href={`/file/${fileNode.id}`} className="flex-shrink-0">
          {!fileNode.metadata?.thumbnail ? (
            <div className="h-16 w-16 rounded-full bg-gray-600 flex items-center justify-center">
              <MusicalNoteIcon className="h-8 w-8" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-16 w-16 rounded-full"
              src={fileNode.metadata?.thumbnail}
              alt={fileNode.name}
            />
          )}
        </a>
        <a href={`/file/${fileNode.id}`} className="flex-grow">
          <div className="text-lg lg:text-2xl font-bold">
            {fileNode.metadata?.title ?? fileNode.name}
          </div>
          <div className="mt-2"><span className="opacity-40">by</span> {fileNode.metadata?.artist ?? "Unknown Artist"}</div>
        </a>
        <button
          className="hover:underline hover:text-yellow-300"
          onClick={() => downloadFile()}
        >
          <ArrowDownTrayIcon className="h-6 w-6" />
        </button>
        <button
          className="hover:underline hover:text-yellow-300"
          onClick={() => deleteFile(false)}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </li>
  );
}
