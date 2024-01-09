import AudioCatalogPage from "./AudioCatalogPage";
import DocumentCatalogPage from "./DocumentCatalogPage";
import ImageCatalogPage from "./ImageCatalogPage";
import UserDefinedCatalogPage from "./UserDefinedCatalogPage";
import VideoCatalogPage from "./VideoCatalogPage";
import { shortenRecordId } from "@/misc/utils";
import AddFileButton from "./AddFilesButton";
import useGetCatalog from "@/hooks/useGetCatalog";
import { CatalogTitle } from "./CatalogTitle";

export default function CatalogPage({
  params: { catalog },
}: {
  params: { catalog: string };
}) {
  let view;
  switch (catalog) {
    case "audio":
      view = <AudioCatalogPage />;
      break;
    case "video":
      view = <VideoCatalogPage />;
      break;
    case "image":
      view = <ImageCatalogPage />;
      break;
    case "other":
      view = <DocumentCatalogPage />;
      break;
    default:
      view = <UserDefinedCatalogPage catalog={catalog} />;
      break;
  }
  return (
    <>
      <div className="flex justify-between gap-2 md:gap-4 lg:gap-6 mb-4 md:mb-8">
        <CatalogTitle catalogId={catalog} />

        {/* Actions */}
        <div className="flex justify-end items-center">
          <AddFileButton catalog={catalog} />
        </div>
      </div>
      {view}
    </>
  );
}
