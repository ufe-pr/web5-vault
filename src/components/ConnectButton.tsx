"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { web5Context } from "@/providers/web5";

export default function ConnectButton() {
  const { isLoading, connect, connectedDid } = useContext(web5Context);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const connectWallet = useCallback(async () => {
    try {
      await connect();
      router.replace("/");
    } catch (e) {
      setError(`${e}`);
    }
  }, [connect, router]);

  return connectedDid ? null : (
    <>
      <button
        className="px-6 py-3 text-lg font-semibold text-white dark:text-black bg-black dark:bg-slate-200 rounded-lg"
        onClick={isLoading ? undefined : connectWallet}
      >
        {isLoading ? "Loading..." : "Connect to App"}
      </button>
      {error && <p className="mt-3 text-red-500">{error}</p>}
    </>
  );
}
