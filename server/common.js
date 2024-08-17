import { Account, Client, Databases, Users } from "node-appwrite";
import "dotenv/config";

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
