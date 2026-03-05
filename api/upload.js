import { put } from "@vercel/blob";
import fs from "node:fs";

export default async function handler(req, res) {
  try {
    // Cambia el nombre del archivo si lo necesitas
    const localPath = "imagenes/tornamesa.jpg";

    if (!fs.existsSync(localPath)) {
      return res.status(400).json({ error: `No existe ${localPath}. Pon tu imagen ahí.` });
    }

    const file = fs.readFileSync(localPath);

    // Subimos como PUBLIC
    const blob = await put("tornamesa.jpg", file, {
      access: "public",
      contentType: "image/jpeg",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}