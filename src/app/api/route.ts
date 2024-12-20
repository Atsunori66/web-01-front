"use server";

import axios from "axios";
import FormData from "form-data";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const url = process.env.LOGIC_APP_STANDARD_URL;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  new DefaultAzureCredential()
);

export async function POST(req: Request) {
  const incomingFormData = await req.formData();
  const file = incomingFormData.get("file");
  const fileName = incomingFormData.get("fileName")!.toString();
  const targetLang = incomingFormData.get("targetLang");

  const containerClient = blobServiceClient.getContainerClient(containerName!);
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  const formData = new FormData();

  if (file instanceof Blob) {
    // コンテナーにアップロード
    const buffer = Buffer.from(await file.arrayBuffer());
    await blockBlobClient.upload(buffer, buffer.length);

    // fileName だけを form から送信
    formData.append("fileName", fileName);
    formData.append("targetLang", targetLang);
  } else {
    return new Response(
      JSON.stringify({
        error: "Invalid file or fileName"
      }),
      { status: 400 }
    );
  }

  try {
      const res = await axios.post(
      url!,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 300000
      }
    );

    if (res.status === 202) {
      const locationHeader = res.headers["location"];
      return new Response(
        null,
        {
          status: 202,
          headers: { location: locationHeader }
        }
      );
    } else if (res.status === 200) {
      return new Response(
        JSON.stringify(
          res.data
        ),
        { status: 200 }
      );
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: "Failed to upload file",
          details: error.message
        }),
        { status: 500 }
      );
    }
  }
};
