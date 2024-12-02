"use client";

import { useEffect, useState } from "react";
import { setCookie, getCookie } from "cookies-next";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = getCookie("cookie-consent");
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookie-consent", "accepted", { maxAge: 60 * 60 * 24 * 365 }); // 1年
    setIsVisible(false);
  };

  const handleReject = () => {
    setCookie("cookie-consent", "rejected", { maxAge: 60 * 60 * 24 * 365 }); // 1年
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 w-full text-lg bg-zinc-100 p-2 border border-black"
    >
      We use cookies to display personalized advertisements based on users' interest.
      <div className="flex justify-center gap-8">
        <button
          className="rounded-full px-6 py-2 font-bold text-white bg-green-400"
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className="rounded-full px-6 py-2 font-bold text-white bg-red-400"
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
