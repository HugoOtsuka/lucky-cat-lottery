import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "../Context/providers";
import { AppContextProvider } from "../Context/AppContext";
import Navbar from "../components/navbar";

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
        <Providers>
          <AppContextProvider>
            <Navbar />
            {children}
          </AppContextProvider>
        </Providers>
      </body>
    </html>
  );
}
