const { put } = require("@vercel/blob");
const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "imagenes", "Short_Afilador_2.jpg");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "No existe imagenes/Short_Afilador_2.jpg" });
    }

    const file = fs.readFileSync(filePath);

  const blob = await put("short_afilador_2.jpg", file, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
    token: process.env.VERCEL_BLOB_TOKEN_READ_WRITE_TOKEN
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