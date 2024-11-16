import Image from "next/image";
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
          Privacy Policy (November 2024)
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
              For any questions or concerns about the service or this privacy policy, please contact us at <span className="text-blue-500 underline">atsuki.sumita@outlook.com</span>.
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
      </main>
      <footer className="flex gap-4 p-4 justify-center">
        <div>
          © {today.getFullYear().toString()} Atsuki Sumita
        </div>
      </footer>
    </div>
  );
};
