"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  LanguageIcon, ChevronDownIcon,
  SunIcon, MoonIcon,
  XMarkIcon, ClipboardDocumentIcon, DocumentTextIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useTheme } from "next-themes";

import { Locale } from "../i18n/i18n-config";
import { getDictionary } from "../i18n/get-dictionary";

import targetLangList from "../targetLangList.json";

// デフォルトの bodyParser を無効化
export const config = {
  api: {
    bodyParser : false
  }
};

const today = new Date();

export default function Home(
  props: {
    params: Promise<{ lang: Locale }>;
  }
) {
  type Dictionary = {
    top: {
      headLine: string;
      main1: string;
      main2: string;
      main3: string;
    };
    mid: {
      format: string;
      button: string;
      result: string;
    };
    footer: {
      policy: string;
      about: string;
      accepted: string;
    };
  };

  const [dictionary, setDictionary] = useState<Dictionary>({
    top: {
      headLine: '',
      main1: '',
      main2: '',
      main3: '',
    },
    mid: {
      format: '',
      button: '',
      result: '',
    },
    footer: {
      policy: '',
      about: '',
      accepted: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const { lang } = await props.params;
      const dict = await getDictionary(lang);
      setDictionary(dict);
    };
    fetchData();
  }, [props.params]);

  const [msg, setMsg] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [returned, setReturned] = useState(false);
  const [copied, setCopied] = useState(false);

  const { setTheme, resolvedTheme } = useTheme();

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [targetLang, setTargetLang] = useState("auto-detect");
  const handleSelect = (language: string) => {
    setTargetLang(language);
  };

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
    setCopied(false);
    setReturned(false);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("fileName", fileName);
    formData.append("targetLang", targetLang);

    try {
      const res = await axios.post(
        "./api",
        formData,
        { timeout: 120000 }
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
            await new Promise((resolve) => setTimeout(resolve, 10000));
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
        setMsg(dictionary.footer.accepted);
        const trackingUrl = res.headers.location;
        pollForResult(trackingUrl);
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMsg(error.message);
      };
    };
  };

  const copyResult = async () => {
    setCopied(true);
    await navigator.clipboard.writeText(msg!);
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
            unoptimized={true}
            priority={true}
          />
          <Image
            src="/images/Lyrixer_logo.svg"
            alt="lyrixer logo"
            width={100}
            height={40}
            unoptimized={true}
            priority={true}
          />
        </div>

        {/* 表示言語変更メニュー */}
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
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/en" }
                >
                  English
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/es" }
                >
                  Español
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/fr" }
                  >
                  Français
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/de" }
                  >
                  Deutsch
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/ja" }
                  >
                  日本語
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/zh" }
                  >
                  中文
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="block px-4 py-2 text-sm
                  text-gray-700 dark:text-gray-200
                  data-[focus]:bg-gray-100 data-[focus]:text-gray-900
                  dark:data-[focus]:bg-gray-800 dark:data-[focus]:text-gray-100"
                  href={ "/ko" }
                  >
                  한국어
                </Link>
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>

        {/* テーマカラートグルボタン */}
        <button className="place-self-center gap-4"
          onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        >
          {
            resolvedTheme === "light" ?
            <SunIcon aria-hidden="true" className="-mr-1 h-5 w-5 stroke-orange-300 fill-orange-300"></SunIcon>
            :
            resolvedTheme === "dark" ?
            <MoonIcon aria-hidden="true" className="-mr-1 h-5 w-5 stroke-yellow-300 fill-yellow-300"></MoonIcon>
            :
            <SunIcon aria-hidden="true" className="-mr-1 h-5 w-5 stroke-orange-300 fill-orange-300"></SunIcon>
          }
        </button>
      </header>

      <main className="grid grid-rows-1 gap-6 p-6">

        {/* Main Texts section */}
        <div className="justify-items-center">
          <div className="pb-4 font-semibold text-2xl">
            { dictionary.top.headLine }
          </div>
          <div>
            <ul className="list-inside text-sm md:text-base font-[family-name:var(--font-geist-mono)]">
              <li className="pl-4 pb-4 list-disc">
                { dictionary.top.main1 }
              </li>
              <li className="pl-4 pb-4 list-disc">
                { dictionary.top.main2 }
              </li>
              <li className="pl-4 pb-4 list-disc">
                { dictionary.top.main3 }
              </li>
            </ul>
          </div>
        </div>

        {/* File Upload section */}
        <div className="grid justify-center gap-4">
          <div className="flex">
            <div className="ml-6 text-lg">
              { uploaded === true ? fileName : "" }
            </div>
            {
              uploaded === true ?
              <XMarkIcon
                className="ml-auto h-6 w-6 text-slate-400 cursor-pointer"
                onClick={ cancelInput }
              >
              </XMarkIcon>
              : ""
            }
          </div>
          <div className="grid md:flex justify-center gap-4">
            <form className="justify-center items-center space-x-6">
              <label className="block min-w-fit max-w-sm">
                <input
                  type="file"
                  name="inputFile"
                  accept=".mp3, .m4a, .aac, .wav, .flac, .aif, .aiff, .mp4"
                  ref={inputFileRef}
                  className="w-full text-sm text-slate-500 py-2 file:cursor-pointer
                    file:mr-2 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={ getInput }
                />
                <div className="text-sm">
                  { dictionary.mid.format }
                </div>
              </label>
            </form>

            {/* list & button */}
            <div className="flex gap-6 justify-self-center">

              {/* title & list */}
              <div className="grid gap-2">
                <div className="font-semibold mb-2">
                  Song Language
                </div>

                {/* targetLang Menu */}
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="inline-flex justify-between w-full rounded-md
                    border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium
                    text-gray-700 hover:bg-gray-50">
                    {targetLang}
                    <ChevronDownIcon className="w-5 h-5 ml-2" aria-hidden="true" />
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 mt-2 w-full rounded-md
                    shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none
                    max-h-64 overflow-y-auto"
                  >
                    <div className="py-1">

                      <MenuItem>
                          <button
                            className="hover:bg-gray-100 text-gray-900
                            } block px-4 py-2 text-sm w-full text-left"
                            onClick={() => handleSelect("auto-detect")}
                          >
                            auto-detect
                          </button>
                      </MenuItem>

                      {/* 区切り線 */}
                      <div className="border-t border-gray-200 my-1" />

                      {/* 各言語 */}
                      {
                        targetLangList.map((target) => (
                        <MenuItem key={target.id}>
                          {
                            () => (
                              <button
                                className="hover:bg-gray-100 text-gray-900
                                block px-4 py-2 text-sm w-full text-left"
                                onClick={() => handleSelect(target.lang)}
                              >
                              {target.lang}
                              </button>
                            )
                          }
                        </MenuItem>
                      )
                      )}
                    </div>
                  </MenuItems>
                </Menu>
              </div>

              {/* button */}
              <button
                className="p-4 min-h-16 h-auto min-w-28 w-auto justify-self-center self-center
                  bg-blue-400 hover:bg-blue-500 active:bg-blue-600
                  text-white font-bold rounded-2xl
                    pointer-events-auto disabled:shadow-none shadow-md shadow-blue-500/50
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={ sendPost }
                disabled={
                  (uploaded === true && loading === false && accepted === false) && (returned === true || msg === null) ? false
                  :
                  uploaded === false || loading === true || accepted === true ? true
                  :
                  true
                }
                >
                { dictionary.mid.button }
              </button>
            </div>
          </div>
        </div>

        {/* Extracted Result section */}
        <div className="pt-4">
          <div className="flex pb-2
          md:pl-16 lg:pl-32 xl:pl-40 2xl:pl-48
          md:ml-16 lg:ml-32 xl:ml-40 2xl:ml-48
          gap-12 md:gap-32 lg:gap-64 xl:gap-80 2xl:gap-96">
            <div className="font-semibold min-w-48">
              { dictionary.mid.result }
            </div>
            {
              returned === true && msg != null ?
              <div className="flex gap-4">
                <ClipboardDocumentIcon
                  className="h-5 w-5 cursor-pointer"
                  onClick={ copyResult }>
                </ClipboardDocumentIcon>
                {
                  copied === true ?
                  <span className="font-bold text-sm">
                    Copied!
                  </span>
                  : ""
                }
              </div>
              : ""
            }
          </div>
          <div className="justify-self-center min-h-40 h-auto w-full md:w-1/2
            break-words text-wrap
            whitespace-pre-wrap p-2 mt-2 rounded-xl shadow-lg
            box-border border-2 border-gray-400 bg-zinc-50 dark:bg-zinc-700"
          >
            {
              loading === true ?
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
          { dictionary.footer.policy }
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
          { dictionary.footer.about }
        </Link>
        <div>
          © {today.getFullYear().toString()} lyrixer.com
        </div>
      </footer>
    </div>
  );
};
