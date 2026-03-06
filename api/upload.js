const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  try {
    const img = (req.query && req.query.img) ? req.query.img : "Tornamesa.jpg";

    // Evitar path traversal
    if (img.includes("..") || img.includes("/")) {
      return res.status(400).json({ error: "Nombre de imagen inválido" });
    }

    const filePath = path.join(process.cwd(), "imagenes", img);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: `No existe imagenes/${img}` });
    }

    const ext = path.extname(img).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" :
      ext === ".webp" ? "image/webp" :
      "image/jpeg";

    const image = fs.readFileSync(filePath);

    res.setHeader("Content-Type", mime);
    res.status(200).send(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};