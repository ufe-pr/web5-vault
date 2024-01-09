"use client";

import useGetFileNode from "@/hooks/useGetFileNode";
import { getFile } from "@/misc/utils";
import { web5Context } from "@/providers/web5";
import { useCallback, useContext, useEffect, useState } from "react";
import DocViewer, {
  DocRenderer,
  DocViewerRenderers,
} from "@cyntler/react-doc-viewer";
import "./style.scss";
import { extractAudioMetadata } from "@/hooks/useUploadFile";

declare module "react" {
  interface CSSProperties {
    "--video-aspect-ratio"?: string;
  }
}

const AudioRenderer: DocRenderer = ({ mainState: { currentDocument } }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  useEffect(() => {
    function dataURItoBlob(dataURI: string) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      //Old Code
      //write the ArrayBuffer to a blob, and you're done
      //var bb = new BlobBuilder();
      //bb.append(ab);
      //return bb.getBlob(mimeString);

      //New Code
      return new File([ab], currentDocument?.fileName!, { type: mimeString });
    }
    async function getThumbnail() {
      if (!currentDocument || !currentDocument.fileData) return;
      const fileData = currentDocument.fileData!;
      const metadata = (await extractAudioMetadata(
        typeof fileData === "string" ? dataURItoBlob(fileData) : fileData
      )) as any;
      setThumbnail(metadata?.thumbnail);
    }
    getThumbnail();
  }, [currentDocument]);
  return (
    <div
      id="audio-renderer"
      className="p-4 py-8 lg:p-8 lg:py-16 w-full min-h-10 flex flex-col gap-4 items-center justify-center text-center text-gray-500"
    >
      {thumbnail && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          className="w-full max-h-[80vh] block object-cover rounded-lg"
          alt="thumbnail"
        />
      )}
      {currentDocument && (
        <audio
          className="w-full"
          controls
          controlsList="nodownload"
          src={currentDocument.uri}
        />
      )}
    </div>
  );
};

AudioRenderer.fileTypes = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
];
AudioRenderer.weight = 0;

export default function FilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { web5 } = useContext(web5Context);
  const [file, setFile] = useState<File | null>();
  const { fileNode, error, isLoading } = useGetFileNode(id);

  const loadFile = useCallback(async () => {
    if (!fileNode || !web5 || !!file) return;
    setFile(await getFile(fileNode, web5));
  }, [file, fileNode, web5]);

  useEffect(() => {
    if (fileNode && !file) loadFile();
  }, [file, fileNode, loadFile]);

  const document = file && {
    uri: window.URL.createObjectURL(file),
    fileName: file.name,
  };
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {`${error}`}</div>
      ) : (
        fileNode &&
        document && (
          <div>
            <DocViewer
              documents={[document]}
              config={{
                noRenderer: {
                  overrideComponent: ({ document, fileName }) => {
                    // Make bigger with more padding
                    return (
                      <div className="p-4 py-8 lg:p-8 lg:py-16 w-full min-h-10 flex items-center justify-center text-center text-gray-500">
                        File type not supported: {fileName}
                      </div>
                    );
                  },
                },
              }}
              className={
                "border rounded-lg" +
                (file.type.startsWith("video") ? " is-video" : "")
              }
              style={{
                "--video-aspect-ratio": Math.max(
                  fileNode?.metadata?.aspectRatio ?? 0,
                  16 / 9
                ).toString(),
              }}
              pluginRenderers={[...DocViewerRenderers, AudioRenderer]}
            />
          </div>
        )
      )}
    </div>
  );
}
