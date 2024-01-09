"use client";

import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { CatalogStoreSchema, Catalog } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useGetCatalog(catalogId: string) {
  const [catalog, setCatalog] = useState<Catalog | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object | null>();
  const { web5 } = useContext(web5Context);

  const getCatalog = useCallback(async () => {
    if (!web5 || !catalogId || catalogId.length < 8) {
      return;
    }
    setIsLoading(true);
    try {
      const { status, record } = await web5.dwn.records.read({
        message: {
          filter: {
            recordId: catalogId,
            protocol: protocols.personalDrive.protocol,
            schema: protocols.personalDrive.types.catalogue.schema,
          },
        },
      });

      if (status.code >= 400 || !record) {
        console.error("Error fetching file nodes", status, record);
        setIsLoading(false);
        return;
      }

      const catalogSchema = (await record.data.json()) as CatalogStoreSchema;
      const catalog: Catalog = {
        ...catalogSchema,
        id: record.id,
      };

      setCatalog(catalog);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [catalogId, web5]);

  useEffect(() => {
    getCatalog();
  }, [getCatalog]);

  return { catalog: catalog, isLoading, error };
}
