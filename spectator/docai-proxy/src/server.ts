import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// create the proxy
const proxy = createProxyMiddleware({
  target: process.env.BASE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader("Authorization", `Bearer ${process.env.TOKEN}`);
  },
});

app.use(cors());
app.use("/", proxy);
app.listen(Number(process.env.PORT) || 3001, process.env.HOST || "localhost");
