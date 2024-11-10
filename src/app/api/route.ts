"use server";

import axios from "axios";
import FormData from "form-data";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";
// const { DefaultAzureCredential } = require('@azure/identity');
// const { BlobServiceClient } = require("@azure/storage-blob");
// import {config} from "dotenv"
// require("dotenv").config();

// const url = "https://prod-23.japaneast.logic.azure.com:443/workflows/5a7ce2df20b748b48a3f02f80b16ff62/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=FrRi6LcsjoYqqMxJPLgWyqdUTdcIWi-xhAwWJ94bYmI";
// const url = "https://logic-02-api-standard.azurewebsites.net:443/api/lyrixer-api/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=vZAoAylqEelI73Ma1JqEbfo7UAxvIba8ldFGS1tXpOM";

const url = process.env.LOGIC_APP_STANDARD_URL;
if (!url) throw Error("Logic App url not found");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error("Azure Storage accountName not found");

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

// デフォルトの bodyParser を無効化
// export const config = {
//   api : {
//     bodyParser : false
//   }
// }

export async function POST(req: Request) {
  const incomingFormData = await req.formData();
  const formData = new FormData();
  const file = incomingFormData.get("file")
  const fileName = incomingFormData.get("fileName")!.toString()

  const containerName = "00-landing";
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  if (file instanceof Blob) {
    // コンテナーにアップロード
    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(buffer, buffer.length);

    // fileName だけを form から送信
    formData.append("fileName", fileName);
  } else {
    return new Response(JSON.stringify({ error: "Invalid file or fileName" }), {
      status: 400,
    });
  }

  try {
    // axiosでの送信設定
    const res = await axios.post(
      url!,
      formData,
      {
        headers: formData.getHeaders()
      }
    );
    const data = res.data;

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: "Failed to upload file", details: error.message }),
        { status: 500 }
      );
    }
  }
};
