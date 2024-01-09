"use client";

import React, { useCallback, useState } from "react";
import { Web5 } from "@web5/api";
import { LOCAL_STORAGE_KEY_DID } from "@/config/constants";

export const web5Context = React.createContext<{
  web5: Web5 | null;
  connectedDid: string | null;
  connect: (did?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isLoading: boolean;
}>({
  web5: null,
  connectedDid: null,
  connect: async (_) => {},
  disconnect: async () => {},
  isLoading: true,
});

export default function Web5Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [connectedDid, setConnectedDid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Connected DID", connectedDid?.split(":").slice(0, 3).join(":"));

  const connect = useCallback(async (did?: string) => {
    setIsLoading(true);
    const { Web5 } = await import("@web5/api");

    try {
      const { web5, did: connectedDid } = await Web5.connect({
        // It also effectively rejects empty string DIDs
        connectedDid: did || undefined,
        sync: "900s",
        techPreview: { dwnEndpoints: ["https://dwn.tbddev.org/dwn1"] },
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_DID, connectedDid);
      setConnectedDid(connectedDid);
      setWeb5(web5);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectedDid(null);
    setWeb5(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_DID);
  }, []);

  return (
    <web5Context.Provider
      value={{
        web5,
        connectedDid,
        connect,
        disconnect,
        isLoading,
      }}
    >
      {children}
    </web5Context.Provider>
  );
}
