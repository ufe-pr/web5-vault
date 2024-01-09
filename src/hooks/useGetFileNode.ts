"use client";

import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { FileNodeStoreSchema, FileNode } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useGetFileNode(id: string) {
  const [fileNode, setFileNode] = useState<FileNode | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object | null>();
  const { web5 } = useContext(web5Context);

  const getFileNode = useCallback(
    async (id: string) => {
      if (!web5) {
        return;
      }
      setIsLoading(true);
      try {
        const { status, record } = await web5.dwn.records.read({
          message: {
            filter: {
              recordId: id,
              protocol: protocols.personalDrive.protocol,
              schema: protocols.personalDrive.types.fileNode.schema,
            },
          },
        });

        if (status.code >= 400 || !record) {
          console.error("Error fetching file nodes", status, record);
          setIsLoading(false);
          return;
        }

        const fileNodeSchema =
          (await record.data.json()) as FileNodeStoreSchema;
        const fileNode: FileNode = {
          ...fileNodeSchema,
          id: record.id,
          createdAt: record.dateCreated,
          updatedAt: record.dateModified,
          parent: record.parentId,
        };

        setFileNode(fileNode);
      } catch (error: any) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [web5]
  );

  useEffect(() => {
    getFileNode(id);
  }, [id, getFileNode]);

  return { fileNode, isLoading, error };
}
