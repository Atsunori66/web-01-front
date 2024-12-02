import Image from "next/image";
import Link from "next/link";
const today = new Date();

export default function Policy() {
  return (
    <div className="min-h-screen">

      <header className="flex gap-4 p-4">
        <div className="flex">
          <Image
            className="mr-auto"
            src="/images/Lyrixer_icon.svg"
            alt="lyrixer icon"
            width={40}
            height={40}
          />
          <Image
            src="/images/Lyrixer_logo.svg"
            alt="lyrixer logo"
            width={100}
            height={40}
          />
        </div>
      </header>

      <main className="grid grid-rows-1 gap-6 p-6 ml-6">
        <div className="pb-4 text-2xl">
          Privacy Policy (December 2024)
        </div>
        <div className="text-base">
          1. About the Service
          <ul className="list-inside">
            <li className="p-2 list-disc">
              This service extracts lyrics from song data uploaded by users.
            </li>
          </ul>
        </div>
        <div className="text-base">
          2. Data Handling
          <ul className="list-inside">
            <li className="p-2 list-disc">
              Uploaded files are used solely for the purpose of extracting lyrics.
            </li>
            <li className="p-2 list-disc">
              Files are immediately deleted after processing and are not stored on our servers.
            </li>
            <li className="p-2 list-disc">
              We do not share the contents of uploaded files with any third party.
            </li>
          </ul>
        </div>
        <div className="text-base">
          3. Collection of Personal Information
          <ul className="list-inside">
            <li className="p-2 list-disc">
              This service does not collect personal information (e.g., names, email addresses).
            </li>
          </ul>
        </div>
        <div className="text-base">
          4. Cookies and Tracking
          <ul className="list-inside">
            <li className="p-2 list-disc">
              We may use minimal cookies or analytics tools to improve the service or for usage analysis (details will be provided if applicable).
            </li>
          </ul>
        </div>
        <div className="text-base">
          5. User Rights
          <ul className="list-inside">
            <li className="p-2 list-disc">
              Users have the right to inquire about how their data is handled.
            </li>
          </ul>
        </div>
        <div className="text-base">
          6. Contact Information
          <ul className="list-inside">
            <li className="p-2 list-disc">
              For any questions or concerns about the service or this privacy policy, please contact us at <span className="text-blue-400 underline">info.contact@lyrixer.com</span>.
            </li>

          </ul>
        </div>
        <div className="text-base">
          7. Policy Updates
          <ul className="list-inside">
            <li className="p-2 list-disc">
              This privacy policy may be updated from time to time.
            </li>
          </ul>
        </div>
        <div className="text-base">
          8. Google AdSense and Cookies
          <div className="py-2">
            This website uses Google AdSense, a program offered by Google to display advertisements. By using this service, the following applies:
          </div>
          <div className="py-2 font-bold">
            How Google Uses Information
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
              Google and its partners use cookies to serve ads based on users' previous visits to this website or other websites.
            </li>
            <li className="p-2 list-disc">
              These cookies enable Google to show ads tailored to your interests.
            </li>
          </ul>
          <div className="py-2 font-bold">
            Third-Party Advertisements
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
              Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website.
            </li>
            <li className="p-2 list-disc">
              Google uses advertising cookies to enable it and its partners to serve ads to you based on your visit to this site and/or other sites on the internet.
            </li>
          </ul>
          <div className="py-2 font-bold">
            Opting Out of Personalized Ads
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
              Users may opt out of personalized advertising by visiting <Link className="text-blue-400 underline" href={"https://adssettings.google.com/"}>Ads Settings</Link>. Alternatively, users can opt out of third-party vendor cookies by visiting <Link className="text-blue-400 underline" href={"https://optout.networkadvertising.org/"}>the Network Advertising Initiative opt-out page</Link>.
            </li>
          </ul>
          <div className="py-2 font-bold">
            Use of Third-Party Cookies
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
            Third-party vendors may place and read cookies on your browser or use web beacons to collect information while serving ads on this site.
            </li>
          </ul>
          <div className="py-2 font-bold">
            Your Choices Regarding Cookies
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
              This site includes a cookie consent banner to inform users about cookie usage and to allow consent management.
            </li>
          </ul>
          <div className="py-2 font-bold">
            Additional Information
          </div>
          <ul className="list-inside">
            <li className="p-2 list-disc">
            To learn more about how Google uses cookies in advertising, visit the <Link className="text-blue-400 underline" href={"https://policies.google.com/privacy"}>Google Privacy Policy</Link>.
            </li>
          </ul>
        </div>
      </main>

      <footer className="flex gap-4 p-4 justify-center">
        <div>
          © {today.getFullYear().toString()} Atsuki Sumita
        </div>
      </footer>

    </div>
  );
};
