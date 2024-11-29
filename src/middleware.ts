import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n } from "./i18n-config";

export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
  matcher: "/:path*",
};

function getLocale(req: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-expect-error locales are readonly
  const locales: string[] = i18n.locales;

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);
  const defaultLocale = i18n.defaultLocale;

  const matchedLocale = match(languages, locales, defaultLocale);
  return matchedLocale;
};

// export function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   const pathnameIsMissingLocale = i18n.locales.every(
//     (locale) =>
//       !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
//   );

//   if (pathnameIsMissingLocale) {
//     const locale = getLocale(request);
//     return NextResponse.redirect(
//       new URL(
//         `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
//         request.url,
//       ),
//     );
//   };

//   return NextResponse.next();
// };


export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|css|js|ico)$/) ||
    pathname.startsWith("/api") ||
    pathname.includes("policy")
  ) {
    return NextResponse.next();
  };

  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  };

  return NextResponse.next();
};

