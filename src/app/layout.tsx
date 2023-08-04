"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { UIContextProvider } from "Context/UIContext";
import { BlockchainContextProvider } from "Context/BlockchainContext";
import Navbar from "components/Navbar";
import { Box } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucky Cat Lottery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UIContextProvider>
          <BlockchainContextProvider>
            <Box position={"sticky"} top={0} width={"100%"} zIndex={1}>
              <Navbar />
            </Box>
            {children}
          </BlockchainContextProvider>
        </UIContextProvider>
      </body>
    </html>
  );
}
