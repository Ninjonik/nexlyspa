import {Account, Client, Functions, Databases, Storage, Avatars} from 'appwrite';

const appwriteEndpoint = import.meta.env.VITE_PUBLIC_APPWRITE_ENDPOINT;
const appwriteProject = import.meta.env.VITE_PUBLIC_APPWRITE_PROJECT;

console.info("ENDPOINT:", appwriteEndpoint)
console.info("PROJECT:", appwriteProject)
// TODO: remove, for debugging purposes only

export const client = new Client();
export const databases = new Databases(client);
export const functions = new Functions(client)

if (appwriteEndpoint && appwriteProject) {
    client
        .setEndpoint(appwriteEndpoint)
        .setProject(appwriteProject);
} else {
    console.error("Please make sure APPWRITE_ENDPOINT and APPWRITE_PROJECT are defined in your environment variables.");
}

export const account = new Account(client);
export const avatars = new Avatars(client);
export const database = import.meta.env.VITE_PUBLIC_APPWRITE_DB_NAME ?? 'appwrite'
export const storage = new Storage(client);
export { ID } from 'appwrite';





