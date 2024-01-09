import type { Metadata } from "next";
import Image from "next/image";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import Web5Provider from "@/providers/web5";
import Shell from "@/components/Shell";
import bgWaves from "@/images/Background.svg";

const inter = League_Spartan({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vault",
  description: "Take full control of your files",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          "bg-gradient-primary min-h-screen bg-fixed " + inter.className
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={bgWaves.src}
          height={bgWaves.height}
          width={bgWaves.width}
          alt=""
          className="absolute w-screen h-screen object-contain -z-10"
        />
        <Web5Provider>
          <Shell>{children}</Shell>
        </Web5Provider>
      </body>
    </html>
  );
}
