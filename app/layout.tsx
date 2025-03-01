import type { Metadata } from "next";

import "./globals.css";

let title = "OpenReactAi – AI Code Generator";
let description = "Generate your next app with AI";
let url = "https://openreactai.com";


export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">


      {children}
    </html>
  );
}
