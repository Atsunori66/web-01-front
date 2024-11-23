"use server";

import axios from "axios";
import FormData from "form-data";
import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const url = process.env.LOGIC_APP_STANDARD_URL;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

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
        timeout: 600000
      }
    );

    if (res.status === 202) {
      const locationHeader = res.headers["location"];
      return new Response(
        JSON.stringify(
          "Request is accepted! Now processing..."
        ),
        {
          status: 202,
          headers: { location: locationHeader }
        }
      );
    } else if (res.status === 200) {
      return new Response(
        JSON.stringify(
          res.data,
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
