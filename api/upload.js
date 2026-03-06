const { put } = require("@vercel/blob");
const fs = require("node:fs");

module.exports = async function handler(req, res) {
  try {
    const localPath = "imagenes/Tornamesa.jpg";

    if (!fs.existsSync(localPath)) {
      return res.status(400).json({ error: `No existe ${localPath}. Pon tu imagen ahí.` });
    }

    const file = fs.readFileSync(localPath);

    const blob = await put("tornamesa.jpg", file, {
      access: "public",
      contentType: "image/jpeg",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return res.status(200).json({ url: blob.url });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};