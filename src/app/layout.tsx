"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { UIContextProvider } from "Context/UIContext";
import { BlockchainContextProvider } from "Context/BlockchainContext";
import Navbar from "components/Navbar";
import { Box, useMediaQuery } from "@chakra-ui/react";
import BurgerMenu from "components/BurgerMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Lucky Cat Lottery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSmallerScreen] = useMediaQuery("(max-width: 768px)");

  return (
    <html lang="en">
      <body className={inter.className}>
        <UIContextProvider>
          <BlockchainContextProvider>
            {isSmallerScreen ? <BurgerMenu /> : <Navbar />}
            <Box mt={isSmallerScreen ? "0px" : "75px"}>{children}</Box>
          </BlockchainContextProvider>
        </UIContextProvider>
      </body>
    </html>
  );
}
