"use server";

import axios from "axios";
import FormData from "form-data";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const url = process.env.LOGIC_APP_STANDARD_URL;
if (!url) throw Error("Logic App url not found");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
if (!accountName) throw Error("Azure Storage accountName not found");

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

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
    const res = await axios.post(
      url!,
      formData,
      {
        headers: formData.getHeaders()
      }
    );
    const data = res.data;

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: "Failed to upload file", details: error.message }),
        { status: 500 }
      );
    }
  }
};
