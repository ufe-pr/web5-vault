"use client";

import protocols from "@/protocols";
import { useConfigureProtocol } from "./useConfigureProtocol";
import { useWeb5Connect } from "./useWeb5Connect";

export function useConfigureApp() {
  const web5State = useWeb5Connect();
  const protocol = useConfigureProtocol(protocols.personalDrive);

  return { web5State, protocol };
}
