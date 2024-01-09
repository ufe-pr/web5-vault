"use client";

import protocols from "@/protocols";
import { web5Context } from "@/providers/web5";
import { CatalogStoreSchema } from "@/types";
import { useContext } from "react";

export default function useCreateCatalog() {
  const { connectedDid, web5 } = useContext(web5Context);
  // Creates a new record on the dwn for a catalog
  // Returns the catalog id
  async function createCatalog(
    name: string,
    description: string
  ): Promise<string> {
    if (!connectedDid || !web5) {
      throw new Error("Not connected");
    }

    const data: CatalogStoreSchema = { name, description };

    const { status, record } = await web5.dwn.records.create({
      data,
      message: {
        protocol: protocols.personalDrive.protocol,
        protocolPath: "catalogue",
        schema: protocols.personalDrive.types.catalogue.schema,
      },
    });

    if (status.code >= 400 || !record) {
      throw new Error(`Error creating catalog: ${status.detail}`, {
        cause: { status, record },
      });
    }

    return record.id;
  }

  return createCatalog;
}
