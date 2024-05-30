import {account} from "./appwrite.ts";

export default async function checkIfUserLoggedIn(){
    try {
        const userAccount: any = await account.get();
        return userAccount;
    } catch (e) { return false; }
}