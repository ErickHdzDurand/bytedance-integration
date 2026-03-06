const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "imagenes", "Tornamesa.jpg");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "No existe imagenes/Tornamesa.jpg" });
    }

    const file = fs.readFileSync(filePath);

  const blob = await put("tornamesa.jpg", file, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
    token: process.env.VERCEL_BLOB_TOKEN
  });

    return res.status(200).json({
      ok: true,
      url: blob.url
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};