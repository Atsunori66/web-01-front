"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LanguageIcon, ChevronDownIcon, XMarkIcon, ClipboardDocumentIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { textList } from "./textList";
import axios from "axios";

// デフォルトの bodyParser を無効化
export const config = {
  api : {
    bodyParser : false
  }
};
const today = new Date();

export default function Home() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [returned, setReturned] = useState(false);
  const [lang, setLang] = useState("en");

  let texts = textList.textEn;
  if (lang == "es") {
    texts = textList.textEs
  } else if (lang == "fr") {
    texts = textList.textFr
  } else if (lang == "ja") {
    texts = textList.textJa
  } else if (lang == "zh") {
    texts = textList.textZh
  } else if (lang == "kr") {
    texts = textList.textKr
  } else {
    texts = textList.textEn
  };

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>("");

  function getInput(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setFileName(selectedFiles[0].name);
      setUploaded(true);
    };
    event.target.value = "";
  };

  function cancelInput() {
    setFiles([]);
    setFileName("");
    setUploaded(false);
    setLoading(false);
    setAccepted(false);
  };

  async function sendPost() {
    if (files.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("fileName", fileName);

    try {
      const res = await axios.post(
        "./api",
        formData,
        { timeout: 600000 }
      );

      const pollForResult = async (trackingUrl: string) => {
        try {
          let result = null;
          while (!result) {
            const res = await axios.get(trackingUrl);
            if (res.status === 200) {
              result = res.data;
              setMsg(result);
              setReturned(true);
              break;
            };
            await new Promise((resolve) => setTimeout(resolve, 5000));
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            setMsg(error.message);
          };
        };
      };

      if (res.status === 202) {
        setAccepted(true);
        setLoading(false);
        setMsg(texts.textAccepted);
        const trackingUrl = res.headers.location;
        pollForResult(trackingUrl);
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message);
      };
    };
  };

  const clickHandler = async () => {
    await navigator.clipboard.writeText(msg!);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">

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

        <Menu as="div" className="place-self-center ml-auto">
          <MenuButton className="inline-flex gap-x-1.5 rounded-md
           bg-white dark:bg-black text-gray-900 dark:text-gray-50
           p-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:dark:bg-gray-800">
            <LanguageIcon aria-hidden="true" className="-mr-1 h-5 w-5"/>
            Language
            <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400"/>
          </MenuButton>

          <MenuItems
            transition
            className="absolute z-10 mt-2 origin-top-right rounded-md
            bg-white dark:bg-black text-black dark:text-white shadow-lg
            ring-1 ring-black ring-opacity-5 transition focus:outline-none
            data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0
            data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <div className="py-1">
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("en") }
                >
                  English
                </div>
                {/* </a> */}
              </MenuItem>
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("es") }
                >
                  Español
                </div>
              </MenuItem>
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("fr") }
                >
                  Français
                </div>
              </MenuItem>
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("ja") }
                >
                  日本語
                </div>
              </MenuItem>
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("zh") }
                >
                  中文
                </div>
              </MenuItem>
              <MenuItem>
                <div className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={ () => setLang("kr") }
                >
                  한국어
                </div>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>

        {/* <button className="place-self-center gap-4"
          onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "dark" : "system")}
        >
          {
            theme === "light" ?
            <MoonIcon aria-hidden="true" className="-mr-1 h-5 w-5 stroke-blue-700 fill-white"></MoonIcon>
            :
            theme === "dark" ?
            <SunIcon aria-hidden="true" className="-mr-1 h-5 w-5 stroke-orange-300 fill-white"></SunIcon>
            :
            typeof(theme)
          }
        </button> */}
      </header>

      <main className="grid grid-rows-1 gap-6 p-6">

        {/* Main Texts section */}
        <div>
          <div className="pb-4 text-2xl">
            { texts.textMain0 }
          </div>
          <div>
            <ul className="list-inside text-sm md:text-base font-[family-name:var(--font-geist-mono)]">
              <li className="pl-4 pb-4 list-disc">
                { texts.textMain1 }
              </li>
              <li className="pl-4 pb-4 list-disc">
                { texts.textMain2 }
              </li>
              <li className="pl-4 pb-4 list-disc">
                { texts.textMain3 }
              </li>
            </ul>
          </div>
        </div>

        {/* File Upload section */}
        <div className="flex justify-center gap-8">
          <form className="justify-center items-center space-x-6">
            <div className="flex">
              <div className="ml-6 text-lg">
                { uploaded == true ? fileName : "" }
              </div>
              {
                uploaded == true ?
                <XMarkIcon
                  className="ml-auto -mr-10 h-6 w-6 text-slate-400 cursor-pointer"
                  onClick={ cancelInput }
                >
                </XMarkIcon>
                : ""
              }
            </div>
            <label className="block min-w-fit max-w-sm">
              <input
                type="file"
                name="inputFile"
                accept=".mp3, .mp4, .m4a, .wav, .aac, .flac"
                ref={inputFileRef}
                className="block w-full text-sm text-slate-500 py-2 file:cursor-pointer
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                onChange={ getInput }
              />
                <div className="text-sm">
                  { texts.textFormat }
                </div>
            </label>
          </form>

          <button className="p-4 min-h-16 h-auto min-w-20 w-auto justify-self-center self-end
            bg-blue-400 hover:bg-blue-500 active:bg-blue-600
            text-white font-bold rounded-2xl
            pointer-events-auto disabled:shadow-none shadow-md shadow-blue-500/50
            disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={ sendPost }
            disabled={
              (uploaded == true && loading == false && accepted == false) && (returned == true || msg == null) ? false
              :
              uploaded == false || loading == true || accepted == true ? true
              :
              true
            }
          >
            { texts.textButton }
          </button>
        </div>

        {/* Extracted Result section */}
        <div className="pt-6">
          <div className="flex">
            <div className="font-semibold">
              { texts.textResult }
            </div>
            {
              returned == true ?
              <ClipboardDocumentIcon
              className="h-5 w-5 ml-36 cursor-pointer place-self-end"
              onClick={ clickHandler }>
              </ClipboardDocumentIcon>
              : ""
            }
          </div>
          <div className="justify-self-center min-h-40 h-auto w-full md:w-7/12
            break-words text-wrap
            whitespace-pre-wrap p-2 mt-4 rounded-xl
            box-border border-2 border-gray-400 bg-zinc-50 dark:bg-zinc-700"
          >
            {
              loading == true ?
              <div className="flex justify-center" aria-label="読み込み中">
                <div className="animate-ping mt-5 h-1 w-1 bg-blue-400 rounded-full"></div>
                <div className="animate-ping mt-5 h-1 w-1 bg-blue-400 rounded-full mx-4"></div>
                <div className="animate-ping mt-5 h-1 w-1 bg-blue-400 rounded-full"></div>
              </div>
              :
              msg
            }
          </div>
        </div>

      </main>

      <footer className="grid md:flex gap-4 md:gap-8 p-2 text-sm md:text-base justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/policy"
          as="policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DocumentTextIcon className="h-5 w-5"></DocumentTextIcon>
          { texts.textPolicy }
        </Link>
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://linkedin.com/in/atsukisumita/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/images/LinkedIn_icon.svg"
            alt="File icon"
            width={20}
            height={20}
          />
          { texts.textAbout }
        </Link>
        <div>
          © {today.getFullYear().toString()} Atsuki Sumita
        </div>
      </footer>
    </div>
  );
};
