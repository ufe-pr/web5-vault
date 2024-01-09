"use client";

import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { CatalogStoreSchema, Catalog } from "@/types";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useGetCatalogs() {
  const [catalogs, setCatalogs] = useState<Catalog[] | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<object | null>();
  const { web5 } = useContext(web5Context);

  const getCatalogFileNodes = useCallback(async () => {
    if (!web5) {
      return;
    }
    setIsLoading(true);
    try {
      const { status, records } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: protocols.personalDrive.protocol,
            schema: protocols.personalDrive.types.catalogue.schema,
          },
        },
      });

      if (status.code >= 400 || !records) {
        console.error("Error fetching file nodes", status, records);
        setIsLoading(false);
        return;
      }

      const catalogs = await Promise.all(
        records.map(async (catalog) => {
          const catalogSchema =
            (await catalog.data.json()) as CatalogStoreSchema;
          const catalog_: Catalog = {
            ...catalogSchema,
            id: catalog.id,
          };
          return catalog_;
        })
      );
      setCatalogs(catalogs);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [web5]);

  useEffect(() => {
    getCatalogFileNodes();
  }, [getCatalogFileNodes]);

  return { catalogs, isLoading, error };
}
