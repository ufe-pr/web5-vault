import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { FileNodeStoreSchema } from "@/types";
import { useCallback, useContext } from "react";
import jsmediatags from "jsmediatags";

export function extractAudioMetadata(file: File | string | ArrayBuffer) {
  return new Promise((resolve, reject) => {
    jsmediatags.read(file, {
      onSuccess: (tag) => {
        const metadata: any = {};
        metadata.title = tag.tags.title;
        metadata.artist = tag.tags.artist;
        metadata.album = tag.tags.album;
        const image = tag.tags.picture;
        if (image) {
          let base64String = "";
          for (let i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
          }
          const base64 = `data:${image.format};base64,${window.btoa(
            base64String
          )}`;
          metadata.thumbnail = base64;
        } else {
          metadata.thumbnail = null;
        }
        resolve(metadata);
        return;
      },
      onError: (error) => {
        if (error.type === "tagFormat") {
          resolve({});
          return;
        }
        reject(error);
      },
    });
  });
}

function extractImageMetadata(file: File) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Context not available");
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = reject;
    img.onload = function () {
      const scaleRatio = 200 / Math.max(img.width, img.height);
      const w = img.width * scaleRatio;
      const h = img.height * scaleRatio;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const thumbnail = canvas.toDataURL(file.type);

      return resolve({ thumbnail, width: w, height: h });
    };
    img.src = window.URL.createObjectURL(file);
  });
}

const extractVideoMetadata = (file: File) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file) + "#t=0.001";

    video.onloadeddata = () => {
      let ctx = canvas.getContext("2d");
      let aspectRatio = video.videoWidth / video.videoHeight;

      canvas.width = 512 * aspectRatio;
      canvas.height = 512;

      ctx!.drawImage(video, 0, 0, canvas.width, canvas.height);
      video.pause();
      const thumbnail = canvas.toDataURL("image/png");
      const duration = video.duration;
      return resolve({ thumbnail, duration, aspectRatio });
    };
  });
};

export function useUploadFile(catalog: string) {
  const { connectedDid, web5 } = useContext(web5Context);
  const fn = useCallback(
    async (file: File) => {
      if (!connectedDid || !web5) {
        throw new Error("Not connected");
      }

      let metadata: any = {};

      if (catalog === "video") {
        metadata = await extractVideoMetadata(file);
      } else if (catalog === "image") {
        metadata = await extractImageMetadata(file);
      } else if (catalog === "audio") {
        metadata = await extractAudioMetadata(file);
      }

      // TODO: Get thumbnail from file and save it in the file node as metadata
      // First create the file node
      const fileNode: FileNodeStoreSchema = {
        name: file.name,
        nodeType: "file",
        fileType: file.type,
        metadata,
        size: file.size,
      };

      const { status: status1, record: fileNodeRecord } =
        await web5.dwn.records.create({
          data: fileNode,
          message: {
            protocol: protocols.personalDrive.protocol,
            protocolPath:
              catalog.length > 8 ? "catalogue/fileNode" : "fileNode",
            schema: protocols.personalDrive.types.fileNode.schema,
            parentId: catalog.length < 8 ? undefined : catalog,
            contextId: catalog.length < 8 ? undefined : catalog,
            dataFormat: "application/json",
          },
        });

      if (status1.code >= 400 || !fileNodeRecord) {
        throw new Error(`Error creating file node: ${status1.detail}`, {
          cause: { status: status1, record: fileNodeRecord },
        });
      }

      const { status, record } = await web5.dwn.records.create({
        data: new Blob([file], { type: file.type }),
        message: {
          protocol: protocols.personalDrive.protocol,
          protocolPath:
            catalog.length > 8 ? "catalogue/fileNode/file" : "fileNode/file",
          schema: protocols.personalDrive.types.file.schema,
          parentId: fileNodeRecord.id,
          contextId: catalog.length < 8 ? fileNodeRecord.id : catalog,
        },
      });

      if (status.code >= 400 || !record) {
        throw new Error(`Error creating file node: ${status.detail}`, {
          cause: status,
        });
      }

      // To optimize queries, save the file record ID in the file node
      const { status: status2 } = await fileNodeRecord.update({
        data: {
          ...fileNode,
          fileID: record.id,
        },
      });

      if (status2.code >= 400) {
        throw new Error(`Error updating file node: ${status2.detail}`, {
          cause: { status: status2, record: fileNodeRecord },
        });
      }

      // TODO: return the file node instead
      return fileNodeRecord;
    },
    [catalog, connectedDid, web5]
  );

  return fn;
}
