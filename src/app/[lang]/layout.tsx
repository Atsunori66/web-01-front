import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { i18n, type Locale } from "../i18n/i18n-config";
import { Providers } from "../providers";
import CookieBanner from "../components/cookie-banner";
import GoogleAdsense from "../components/google-adsense";
import { GoogleTagManager } from "@next/third-parties/google";

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
  description: "Discover the ultimate AI lyrics extractor! Quickly and accurately extract lyrics from any song, 100% free.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
  }) {
  const params = await props.params;
  const { children } = props;
  return (
    <html lang={ params.lang } suppressHydrationWarning>
      {!!process.env.GOOGLE_ANALYTICS_ID && (
        <GoogleTagManager gtmId={process.env.GOOGLE_ANALYTICS_ID} />
      )}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          { children }
          <CookieBanner/>
        </Providers>
      </body>
      <GoogleAdsense/>
    </html>
  );
};
