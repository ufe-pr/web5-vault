"use client";
import { useConfigureApp } from "@/hooks/useConfigureApp";
import ConnectButton from "./ConnectButton";
import vaultLogo from "@/images/Vault.svg";
import Image from "next/image";

// TODO: Add more functionality to the shell
export default function Shell({ children }: { children: React.ReactNode }) {
  useConfigureApp();

  return (
    <>
      <header className="flex justify-between items-center p-4 md:p-6 lg:p-8 mb-4">
        <a href="/">
          <Image src={vaultLogo.src} alt="Vault" className="h-10" width={vaultLogo.width} height={vaultLogo.height} />
        </a>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </header>
      <main className="p-4 md:p-6 lg:p-8">{children}</main>
    </>
  );
}
