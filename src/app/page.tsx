"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { LanguageIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
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
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [lang, setLang] = useState("en")

  let texts = textList.textEn;
  if (lang == "es") {
    texts = textList.textEs
  }
  else if (lang == "fr") {
    texts = textList.textFr
  }
  else if (lang == "ja") {
    texts = textList.textJa
  }
  else if (lang == "zh") {
    texts = textList.textZh
  }
  else if (lang == "kr") {
    texts = textList.textKr
  }
  else {
    texts = textList.textEn
  };

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>("");

  // function onChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const inputFile = inputFileRef["current"]
  //   const fileName = inputFileNameRef.current!.value;
  //   setUploaded(true);
  //   setFiles([...event.target.files]);
  //   event.target.value = "";
  // }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      setFileName(selectedFiles[0].name);
      setUploaded(true);
    }
    // Clear the input after selection
    // event.target.value = "";
  }

  async function sendPost() {
    if (files.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("fileName", fileName);

    try {
      const instance = axios.create();
      const res = await instance.post(
        "../api",
        formData,
        {
          timeout: 600000
        }
      );
      // const res = await fetch("../api", {
      //   method: "POST",
      //   body: formData,
      // });
      // const data = await res.text();
      const data = await res.data;
      setMsg(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message);
      }
    } finally {
      setLoading(false);
    };
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
            className="absolute z-10 mt-2 origin-top-right rounded-md bg-white dark:bg-black text-black dark:text-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
        <div>
          <div className="pb-4 text-2xl">
            { texts.textMain0 }
          </div>
          <div>
            <ul className="list-inside text-base text-left font-[family-name:var(--font-geist-mono)]">
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

        <div className="flex justify-center gap-8">
          <form className="flex justify-center items-center space-x-6">
            <label className="block min-w-fit max-w-sm">
              <input
                type="file"
                name="inputFile"
                accept=".mp3, .m4a, .flac, .wav"
                ref={inputFileRef}
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                onChange={ onChange }
              />
                { texts.textFormat }
            </label>
          </form>

          <button className="p-4 w-auto justify-self-center
            bg-sky-400 hover:bg-sky-500 active:bg-sky-600
            text-white font-bold rounded-2xl
            pointer-events-auto"
            onClick={ sendPost }
            disabled={!uploaded || loading}
          >
            { texts.textButton }
          </button>
        </div>

        <div>
          <div className="pl-4 font-semibold">
            { texts.textResult }
          </div>
          <div className="justify-self-center min-h-48 h-auto w-full md:w-7/12
            break-words text-wrap
            whitespace-pre-wrap p-2 mt-4
            box-border border-2 border-gray-400 border-dotted"
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

      <footer className="flex gap-4 p-4 justify-center">
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/policy"
          as="policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={20}
            height={20}
          />
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
