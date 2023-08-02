import "./globals.css";
import { Inter } from "next/font/google";
import { UIContextProvider } from "../Context/UIContext";
import { BlockchainContextProvider } from "../Context/BlockchainContext";
import Navbar from "components/Navbar";

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
            <Navbar />
            {children}
          </BlockchainContextProvider>
        </UIContextProvider>
      </body>
    </html>
  );
}
