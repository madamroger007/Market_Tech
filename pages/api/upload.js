import multiparty from "multiparty";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from "fs";
import mime from "mime-types";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  const form = new multiparty.Form();
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
  const client = new S3Client({
    region: "ap-southeast-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const links = [];
  console.log(files.file.length);
  for (const file of files.file) {
    const path = file.path.split("/").pop();
    const newFilename = Date.now() + "-" + path;
    console.log(newFilename);
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: newFilename,
        Body: fs.readFileSync(file.path),
        ACL: "public-read",
        ContentType: mime.lookup(file.path),
      })
    );

    const link = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${newFilename}`;
    links.push(link);
  }

  return res.json({links});
}

export const config = {
  api: { bodyParser: false },
};
