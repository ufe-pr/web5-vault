import { useCallback, useContext } from "react";
import useGetFileNode from "./useGetFileNode";
import { web5Context } from "@/providers/web5";
import { useRouter } from "next/navigation";
import { FileNodeStoreSchema } from "@/types";
import { getFile } from "@/misc/utils";

export default function useFileCallbacks(fileNodeId: string) {
  const router = useRouter();
  const { fileNode } = useGetFileNode(fileNodeId);
  const { web5 } = useContext(web5Context);

  const deleteFile = useCallback(
    async (shouldPopPage: boolean) => {
      if (!web5 || !fileNode || fileNode.nodeType !== "file") return;
      console.log("delete file", fileNodeId);

      const { status, record: fileNodeRecord } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: fileNodeId,
          },
        },
      });
      const { status: status2, record: fileRecord } =
        await web5.dwn.records.read({
          message: {
            filter: {
              parentId: fileNodeId,
            },
          },
        });
      if (
        status.code >= 400 ||
        status2.code >= 400 ||
        !fileNodeRecord ||
        !fileRecord
      ) {
        throw new Error(`Error deleting file node: ${status.detail}`, {
          cause: { status, record: fileNodeRecord },
        });
      }

      await web5.dwn.records.delete({
        message: {
          recordId: fileNodeId,
        },
      });
      await web5.dwn.records.delete({
        message: {
          recordId: fileRecord.id,
        },
      });

      if (shouldPopPage) {
        router.back();
      }
    },
    [fileNode, fileNodeId, router, web5]
  );

  const renameFile = useCallback(
    async (newName: string) => {
      console.log("rename file", fileNodeId, newName);

      if (!web5 || !fileNode || fileNode.nodeType !== "file") return;

      let { status, record: fileNodeRecord } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: fileNodeId,
          },
        },
      });
      if (status.code >= 400 || !fileNodeRecord) {
        throw new Error(`Error renaming file node: ${status.detail}`, {
          cause: { status, record: fileNodeRecord },
        });
      }

      const newData: FileNodeStoreSchema = {
        nodeType: "file",
        fileID: fileNode.fileID,
        name: newName,
        fileType: fileNode.fileType,
        metadata: fileNode.metadata,
        size: fileNode.size,
      };
      ({ status } = await fileNodeRecord.update({
        data: newData,
      }));
      if (status.code >= 400) {
        throw new Error(`Error renaming file node: ${status.detail}`, {
          cause: { status, record: fileNodeRecord },
        });
      }
    },
    [fileNode, fileNodeId, web5]
  );

  const downloadFile = useCallback(async () => {
    const download = (path: string, filename: string) => {
      // Create a new link
      const anchor = document.createElement("a");
      anchor.href = path;
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    };

    console.log("download file", fileNodeId);
    if (!web5 || !fileNode || fileNode.nodeType !== "file") return;
    const file = await getFile(fileNode, web5);
    if (!file) return;
    const url = URL.createObjectURL(file);

    download(url, fileNode.name);
  }, [fileNode, fileNodeId, web5]);

  const shareFile = useCallback(() => {
    console.log("share file", fileNodeId);
  }, [fileNodeId]);

  const copyFile = useCallback(() => {
    console.log("copy file", fileNodeId);
  }, [fileNodeId]);

  return {
    deleteFile,
    renameFile,
    downloadFile,
    shareFile,
    copyFile,
  };
}
