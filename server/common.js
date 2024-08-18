import { Account, Client, Databases, Users } from "node-appwrite";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: `${__dirname}/.env` });

export const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT)
  .setKey(process.env.APPWRITE_KEY);

export const database = new Databases(client);
export const users = new Users(client);

export const jwtClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT);

export const jwtAccount = new Account(jwtClient);
export const jwtDatabases = new Databases(jwtClient);
