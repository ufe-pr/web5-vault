"use client";

import useFileCallbacks from "@/hooks/useFileCallbacks";
import useGetCatalogFileNodes from "@/hooks/useGetCatalogFileNodes";
import { FileNode } from "@/types";
import {
  ArrowDownTrayIcon,
  DocumentIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function UserDefinedCatalogPage({
  catalog,
}: {
  catalog: string;
}) {
  const { error, fileNodes, isLoading } = useGetCatalogFileNodes(catalog);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {`${error}`}</div>}
      {fileNodes && (
        <ul>
          {fileNodes.map((fileNode) => (
            <DocumentItem
              key={fileNode.id}
              fileNode={fileNode}
              catalog={catalog}
            />
          ))}
        </ul>
      )}
    </>
  );
}

function DocumentItem({
  fileNode,
  catalog,
}: {
  fileNode: FileNode;
  catalog: string;
}) {
  const { downloadFile, deleteFile } = useFileCallbacks(fileNode.id);

  return (
    <li className="mt-4 lg:mt-8 first-of-type:mt-0">
      <div className="flex gap-4 items-center rounded-lg bg-black text-white p-4">
        <div className="h-8 w-8 lg:h-16 lg:w-16 flex items-center justify-center rounded-full bg-gray-600">
          <DocumentIcon className="h-6 w-6 inline-block" />
        </div>
        <a
          href={`/catalog/${catalog}/${fileNode.id}`}
          className="block grow hover:underline"
        >
          {fileNode.name}
        </a>
        <button
          className="block text-center hover:underline hover:text-yellow-300"
          onClick={() => downloadFile()}
        >
          <ArrowDownTrayIcon className="w-6 h-6 inline-block" />
        </button>
        <button
          className="block text-center hover:underline hover:text-red-500"
          onClick={() => deleteFile(false)}
        >
          <TrashIcon className="w-6 h-6 inline-block" />
        </button>
      </div>
    </li>
  );
}
