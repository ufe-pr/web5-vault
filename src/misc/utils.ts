import protocols from "@/protocols";
import { FileNode } from "@/types";
import { Web5 } from "@web5/api";

export function shortenRecordId(id: string): string {
  if (id.length < 15) return id;
  const front = id.substring(0, 6);
  const end = id.substring(id.length - 6);

  return `${front}..${end}`;
}

export async function getFile(
  fileNode: FileNode,
  web5: Web5
): Promise<File | undefined> {
  if (fileNode.nodeType !== "file") return;
  console.log("Getting file", fileNode);
  let record, status;
  if (!fileNode.fileID) {
    ({ status, record } = await web5.dwn.records.read({
      message: {
        filter: {
          parentId: fileNode.id,
          schema: protocols.personalDrive.types.file.schema,
          protocol: protocols.personalDrive.protocol,
          protocolPath: !fileNode.parent ? undefined : "catalogue/fileNode/file",
          contextId: !fileNode.parent ? undefined : fileNode.parent,
        },
      },
    }));
  } else {
    ({ status, record } = await web5.dwn.records.read({
      message: {
        filter: {
          recordId: fileNode.fileID,
          schema: protocols.personalDrive.types.file.schema,
          protocol: protocols.personalDrive.protocol,
          protocolPath: !fileNode.parent ? undefined : "catalogue/fileNode/file",
          contextId: !fileNode.parent ? undefined : fileNode.parent,
        },
      },
    }));
  }

  if (status.code >= 400) {
    console.error("Error getting file", status);
    return;
  }

  const file = await record.data.blob();

  return new File([file], fileNode.name, { type: fileNode.fileType });
}
