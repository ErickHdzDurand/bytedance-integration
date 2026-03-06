const fs = require("fs");
const path = require("path");

module.exports = async function handler(req, res) {
  try {

    const filePath = path.join(process.cwd(), "imagenes", "Tornamesa.jpg");

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Imagen no encontrada en imagenes/Tornamesa.jpg" });
    }

    const image = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "image/jpeg");
    res.status(200).send(image);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};