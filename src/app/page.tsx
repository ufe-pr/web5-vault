"use client";

import useGetCatalogs from "@/hooks/useGetCatalogs";
import {
  ChevronRightIcon,
  FolderPlusIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import {
  MusicalNoteIcon,
  FilmIcon,
  PhotoIcon,
  DocumentIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";

type Category = {
  name: string;
  catalogue: string;
  icon?: React.ReactNode;
};

const defaultCategories: Category[] = [
  { name: "Audio", catalogue: "audio", icon: <MusicalNoteIcon /> },
  { name: "Video", catalogue: "video", icon: <FilmIcon /> },
  { name: "Image", catalogue: "image", icon: <PhotoIcon /> },
  { name: "Other", catalogue: "other", icon: <DocumentIcon /> },
];

export default function Home() {
  const { catalogs, error, isLoading } = useGetCatalogs();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
      {defaultCategories.map((category) => (
        <a
          href={`/catalog/${category.catalogue}`}
          key={category.catalogue}
          className="bg-black text-[#efde40] p-4 text-lg rounded-xl hover:-translate-y-1 hover:shadow-2xl duration-150"
        >
          <div className="block">
            <span className="text-white">Vault</span>
            <span className="block ml-4">{category.name}</span>
          </div>
          <div className="mt-6 md:mt-8 lg:mt-10 flex justify-between">
            <span className=" h-6 w-6 block">{category.icon}</span>
            <span className="block group">
              <ChevronRightIcon className="h-6 w-6 group-hover:opacity-100 opacity-85 duration-150" />
            </span>
          </div>
        </a>
      ))}
      {!isLoading &&
        !error &&
        catalogs &&
        catalogs.map((catalog) => (
          <a
            href={`/catalog/${catalog.id}`}
            key={catalog.id}
            className="bg-black text-[#efde40] p-4 text-lg rounded-xl hover:-translate-y-1 hover:shadow-2xl duration-150"
          >
            <div className="block">
              <span className="block">{catalog.name}</span>
            </div>
            <div className="mt-6 md:mt-8 lg:mt-10 flex justify-between">
              <span className=" h-6 w-6 block">
                <PencilSquareIcon className="h-6 w-6 group-hover:opacity-100 opacity-85 duration-150" />
              </span>
              <span className="block group">
                <ChevronRightIcon className="h-6 w-6 group-hover:opacity-100 opacity-85 duration-150" />
              </span>
            </div>
          </a>
        ))}
      <a
        href="/catalog/add"
        className="flex justify-center flex-col items-center bg-black text-fuchsia-400 text-center p-4 text-lg rounded-xl hover:-translate-y-1 hover:shadow-2xl duration-150"
      >
        <div>Create your Catalogue</div>
        <div className="mt-4">
          <FolderPlusIcon className="h-8 w-8 text-white" />
        </div>
      </a>
    </div>
  );
}
