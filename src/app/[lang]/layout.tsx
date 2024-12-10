import "../globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { i18n, type Locale } from "../i18n/i18n-config";
import { Providers } from "../providers";
import CookieBanner from "../components/cookie-banner";
import GoogleAdsense from "../components/google-adsense";
import { GoogleAnalytics } from "@next/third-parties/google";
// import { Geist, Geist_Mono } from "next/font/google";

// opengraph-image が動的ルートに未対応
export const metadata: Metadata = {
  title: "LyriXer - Lyrics Extractor AI",
  description: "This is your new favorite AI lyrics extractor! Quickly and accurately extract lyrics from any song, 100% free.",
  // openGraph: {
  //   title: "LyriXer - Lyrics Extractor AI",
  //   description: "Extracts lyrics from any song. 100% free."
  // },
  // twitter: {
  //   title: "LyriXer - Lyrics Extractor AI",
  //   description: "Extracts lyrics from any song. 100% free.",
  //   card: "summary_large_image"
  // }
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
  const gaID = process.env.GOOGLE_ANALYTICS_ID;

  return (
    <html lang={ params.lang } suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          { children }
          <CookieBanner/>
        </Providers>
      </body>
      <GoogleAdsense/>
      { !!gaID && <GoogleAnalytics gaId={gaID} /> }
    </html>
  );
};
