const express = require("express");
const jwt = require("jsonwebtoken");
const fetch = (...args) =>
  import("node-fetch").then(({ default: f }) => f(...args));
const app = express();
app.use(express.json());

const SHARED_SECRET = process.env.SHARED_SECRET || "devsecret";
const CATALOG_URL = process.env.CATALOG_URL || "http://catalog:3000";

app.get("/health", (_req, res) => res.send("ok"));

app.post("/auth/token", (req, res) => {
  const { user = "demo" } = req.body || {};
  const token = jwt.sign({ sub: user, scope: "orders:create" }, SHARED_SECRET, {
    expiresIn: "10m",
  });
  res.json({ token });
});

function authMiddleware(req, res, next) {
  const hdr = req.headers["authorization"] || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "missing token" });
  try {
    req.user = jwt.verify(token, SHARED_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid token" });
  }
}

app.post("/orders", authMiddleware, async (req, res) => {
  const { items = [] } = req.body || {};
  const catResp = await fetch(`${CATALOG_URL}/catalog`);
  const catalog = await catResp.json();

  const priceMap = new Map(catalog.map((p) => [p.sku, p.price]));
  let total = 0;
  for (const it of items) {
    const price = priceMap.get(it.sku);
    if (!price)
      return res.status(400).json({ error: `SKU not found: ${it.sku}` });
    total += price * (it.qty || 1);
  }
  const order = {
    id: `ord_${Date.now()}`,
    total: Number(total.toFixed(2)),
    items,
  };

  res.status(201).json(order);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`orders-service on ${port}`));
