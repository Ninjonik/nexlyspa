import express from "express";
import cors from "cors"; // Import CORS
import checkCallStatus from "./routes/checkCallStatus.js";
import checkRoom from "./routes/checkRoom.js";
import createRoom from "./routes/createRoom.js";
import deleteUser from "./routes/deleteUser.js";
import getParticipantToken from "./routes/getParticipantToken.js";
import joinRoom from "./routes/joinRoom.js";
import leaveRoom from "./routes/leaveRoom.js";
import sendMessage from "./routes/sendMessage.js";
import startCall from "./routes/startCall.js";
import "dotenv/config";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import https from "https";
import becomeAdmin from "./routes/becomeAdmin.js";

import { argv } from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = argv && argv.includes("dev");

dev
  ? dotenv.config({ path: `${__dirname}/.env.local` })
  : dotenv.config({ path: `${__dirname}/.env` });

const privKey = process.env.SSL_PRIV_KEY;
const cert = process.env.SSL_CERT;

const app = express();
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = process.env.PORT || 4186;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (privKey && cert) {
  const privateKey = fs.readFileSync(privKey, "utf8");
  const certificate = fs.readFileSync(cert, "utf8");
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, hostname, undefined, () => {
    console.log(
      `Server running ${dev ? " in dev mode" : ""} at https://${hostname}:${port}`,
    );
  });
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(port, hostname, undefined, () => {
    console.log(
      `Server running${dev ? " in dev mode" : ""} at http://${hostname}:${port}`,
    );
  });
}

// Start server

app.use(checkCallStatus);
app.use(becomeAdmin);
app.use(checkRoom);
app.use(createRoom);
app.use(deleteUser);
app.use(getParticipantToken);
app.use(joinRoom);
app.use(leaveRoom);
app.use(sendMessage);
app.use(startCall);
