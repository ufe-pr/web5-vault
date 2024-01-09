"use client";

import useFileCallbacks from "@/hooks/useFileCallbacks";
import useGetCatalogFileNodes from "@/hooks/useGetCatalogFileNodes";
import { FileNode } from "@/types";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";

export default function ImageCatalogPage() {
  const { error, fileNodes, isLoading } = useGetCatalogFileNodes("image");

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {`${error}`}</div>}
      {fileNodes && (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
          {fileNodes.map((fileNode) => (
            <ImageItem key={fileNode.id} fileNode={fileNode} />
          ))}
        </ul>
      )}
    </>
  );
}

function ImageItem({ fileNode }: { fileNode: FileNode }) {
  const { downloadFile } = useFileCallbacks(fileNode.id);

  return (
    <li>
      <div className="rounded-xl w-full relative pt-[100%]">
        {!fileNode.metadata?.thumbnail ? (
          <div className="absolute top-0 left-0 w-full h-full rounded-lg bg-gray-600" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="absolute top-0 left-0 w-full h-full rounded-lg object-cover bg-gray-900"
            src={fileNode.metadata?.thumbnail}
            alt={fileNode.name}
          />
        )}
      </div>
      <div className="flex gap-4">
        <a
          href={`/file/${fileNode.id}`}
          className="block mt-2 text-center hover:underline"
        >
          {fileNode.name}
        </a>
        <button
          className="block mt-2 text-center hover:underline"
          onClick={() => downloadFile()}
        >
          <ArrowDownTrayIcon className="w-6 h-6 inline-block" />
        </button>
      </div>
    </li>
  );
}
