const express = require("express");
const app = express();

const catalog = [
  { sku: "VINHO_TINTO_001", name: "Tinto Reserva", price: 79.9 },
  { sku: "VINHO_BRANCO_001", name: "Branco Jovem", price: 59.9 },
];

app.get("/health", (_req, res) => res.send("ok"));
app.get("/catalog", (_req, res) => res.json(catalog));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`catalog-service on ${port}`));
