import { LOCAL_STORAGE_KEY_DID } from "@/config/constants";
import { web5Context } from "@/providers/web5";
import { useContext, useEffect } from "react";

export function useWeb5Connect() {
  const web5ContextValue = useContext(web5Context);
  const { connect, connectedDid, isLoading } = web5ContextValue;

  useEffect(() => {
    const did = localStorage.getItem(LOCAL_STORAGE_KEY_DID);
    if (did && !connectedDid && !isLoading) {
      connect(did);
    }
  }, [connectedDid, connect, isLoading]);

  return web5ContextValue;
}
