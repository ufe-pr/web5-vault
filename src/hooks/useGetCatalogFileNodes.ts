"use client";

import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { FileNodeStoreSchema, FileNode } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useGetCatalogFileNodes(catalog: string) {
  const [fileNodes, setFileNodes] = useState<FileNode[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object | null>();
  const { web5 } = useContext(web5Context);

  const getCatalogFileNodes = useCallback(
    async (catalog: string) => {
      if (!web5) {
        return;
      }
      setIsLoading(true);
      try {
        const types = ["audio", "video", "image", "other"];
        const { status, records } = await web5.dwn.records.query({
          message: {
            filter: {
              protocol: protocols.personalDrive.protocol,
              schema: protocols.personalDrive.types.fileNode.schema,
              contextId: types.includes(catalog) ? undefined : catalog,
            },
          },
        });

        if (status.code >= 400 || !records) {
          console.error("Error fetching file nodes", status, records);
          setIsLoading(false);
          return;
        }

        const fileNodes = await Promise.all(
          records.map(async (record) => {
            const fileNodeSchema =
              (await record.data.json()) as FileNodeStoreSchema;
            const fileNode: FileNode = {
              ...fileNodeSchema,
              id: record.id,
              createdAt: record.dateCreated,
              updatedAt: record.dateModified,
            };
            return fileNode;
          })
        );
        setFileNodes(
          fileNodes.filter((node) => {
            if (!types.includes(catalog)) return true;

            if (node.nodeType === "file") {
              const t = node.fileType?.split("/")[0];
              if (catalog === "other") return !types.includes(t || "");
              return t === catalog;
            }

            return false;
          })
        );
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [web5]
  );

  useEffect(() => {
    getCatalogFileNodes(catalog);
  }, [catalog, getCatalogFileNodes]);

  return { fileNodes, isLoading, error };
}
