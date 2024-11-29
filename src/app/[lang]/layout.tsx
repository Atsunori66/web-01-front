import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { i18n, type Locale } from "../../i18n-config";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LyriXer - Lyrics Extractor AI",
  description: "Your new favorite lyrics extractor AI and it's completely free.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;
  const { children } = props;
  return (
    <html lang={ params.lang }>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        { children }
      </body>
    </html>
  );
};
