"use client";

import useGetCatalog from "@/hooks/useGetCatalog";

export function CatalogTitle({ catalogId }: { catalogId: string }) {
  const { catalog } = useGetCatalog(catalogId);

  return (
    <h1 className="capitalize">
      {catalogId.length > 10 ? catalog?.name : catalogId}
    </h1>
  );
}