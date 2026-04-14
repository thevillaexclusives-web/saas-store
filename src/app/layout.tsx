import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Villa Storefront",
  description:
    "Discover published property collections from your selected organization storefront.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
