"use client";

import { Link, redirect } from "react-router-dom";
// @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
import { useActionState } from "react";
import { account } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";
import { UserAuthObject } from "../utils/interfaces/UserObject.ts";
import { ID } from "appwrite";

export const Register = () => {
  const { getUserData, logoutUser } = useUserContext();

  const handleRegister = async (_prevState: null, queryData: FormData) => {
    const username = queryData.get("username") as string;
    const email = queryData.get("email") as string;
    const password = queryData.get("password") as string;
    if (!email || !password) return "Please fill all the fields.";

    await logoutUser();
    try {
      await account.create(ID.unique(), email, password, username);
      await account.createEmailPasswordSession(email, password);
      const newAccount = (await account.get()) as UserAuthObject;
      await getUserData(newAccount);
      redirect("/home");
    } catch (e) {
      return (e as Error).message;
    }
  };

  const [message, formAction] = useActionState(handleRegister, null);

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/img/background.svg')] bg-cover">
      <section
        className={
          "h-full w-full md:h-auto md:w-auto p-8 flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md text-center gap-4"
        }
      >
        <h2>Welcome to Nexly!</h2>
        <h3>We're so excited to meet you!</h3>
        <h4 className={"text-red-500"}>{message}</h4>
        <form className={"flex flex-col gap-4"} action={formAction}>
          <input
            type="text"
            name={"username"}
            placeholder="Enter your username"
            required={true}
          />
          <input
            type="email"
            name={"email"}
            placeholder="Enter your email"
            required={true}
          />
          <input
            type="password"
            name={"password"}
            placeholder="Enter a password"
            required={true}
          />
          <Link to={"/login/anonymous"}>
            Continue with a one-time anonymous account?
          </Link>
          <button type={"submit"} className={"w-full"}>
            Create a new account
          </button>
          <span>
            Already have an account?&nbsp;
            <Link to={"/login"}>Log in</Link>
          </span>
        </form>
      </section>
    </main>
  );
};
