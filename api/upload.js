const { put } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "Método no permitido. Usa POST."
      });
    }

    console.log("TOKEN presente:", !!process.env.BLOB_READ_WRITE_TOKEN);

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const bodyBuffer = Buffer.concat(chunks);

    const contentType = req.headers["content-type"] || "";
    const boundaryMatch = contentType.match(/boundary=(.*)$/);

    if (!boundaryMatch) {
      return res.status(400).json({
        ok: false,
        error: "No se encontró boundary en multipart/form-data"
      });
    }

    const boundary = `--${boundaryMatch[1]}`;
    const bodyText = bodyBuffer.toString("binary");

    const filenameMatch = bodyText.match(/filename="([^"]+)"/);
    if (!filenameMatch) {
      return res.status(400).json({
        ok: false,
        error: "No se encontró archivo en la petición"
      });
    }

    const originalFilename = filenameMatch[1];
    const extension = originalFilename.includes(".")
      ? originalFilename.substring(originalFilename.lastIndexOf("."))
      : ".jpg";

    const startFileIndex = bodyText.indexOf("\r\n\r\n") + 4;
    const endBoundaryIndex = bodyText.lastIndexOf(boundary) - 2;

    if (startFileIndex < 4 || endBoundaryIndex <= startFileIndex) {
      return res.status(400).json({
        ok: false,
        error: "No se pudo extraer el contenido del archivo"
      });
    }

    const fileBuffer = bodyBuffer.subarray(startFileIndex, endBoundaryIndex);

    const safeBaseName = originalFilename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const blobName = `${Date.now()}_${safeBaseName}${extension}`;

    const blob = await put(blobName, fileBuffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: req.headers["x-file-content-type"] || "application/octet-stream",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return res.status(200).json({
      ok: true,
      originalFilename,
      blobName,
      url: blob.url
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
};