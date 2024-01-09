"use client";

import useFileCallbacks from "@/hooks/useFileCallbacks";
import useGetCatalogFileNodes from "@/hooks/useGetCatalogFileNodes";
import { FileNode } from "@/types";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/outline";

function zeroPad(number: any, length: number) {
  var str = number.toString();
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}

function formatDuration(duration: number) {
  var seconds = Math.abs(Math.ceil(duration)),
    h = (seconds - (seconds % 3600)) / 3600,
    m = ((seconds - (seconds % 60)) / 60) % 60,
    s = seconds % 60;
  return (
    (duration < 0 ? "-" : "") +
    h +
    ":" +
    zeroPad(m.toString(), 2) +
    ":" +
    zeroPad(s.toString(), 2)
  );
}

export default function VideoCatalogPage() {
  const { error, fileNodes, isLoading } = useGetCatalogFileNodes("video");

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {`${error}`}</div>}
      {fileNodes && (
        <ul>
          {fileNodes.map((fileNode) => (
            <VideoItem key={fileNode.id} fileNode={fileNode} />
          ))}
        </ul>
      )}
    </>
  );
}

function VideoItem({ fileNode }: { fileNode: FileNode }) {
  const { downloadFile, deleteFile } = useFileCallbacks(fileNode.id);
  return (
    <li key={fileNode.id} className="mt-4 lg:mt-8 first-of-type:mt-0">
      <div className="flex items-center gap-4 lg:gap-8 rounded-xl p-4 bg-black text-white">
        <a href={`/file/${fileNode.id}`} className="flex-shrink-0">
          {!fileNode.metadata?.thumbnail ? (
            <div className="h-16 w-24 rounded-lg bg-gray-600" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="h-16 w-24 rounded-lg object-contain bg-gray-900"
              src={fileNode.metadata?.thumbnail}
              alt={fileNode.name}
            />
          )}
        </a>
        <a href={`/file/${fileNode.id}`} className="flex-grow">
          <h2 className="text-lg font-bold">{fileNode.name}</h2>
          <div className="mt-2">
            {/* TODO: Format duration */}
            {formatDuration(fileNode.metadata?.duration) ?? "--:--:--"}
          </div>
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
