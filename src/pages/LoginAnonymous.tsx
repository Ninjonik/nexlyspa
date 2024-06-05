"use client";

import { Link, useNavigate } from "react-router-dom";
// @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
import { useActionState } from "react";
import { account } from "../utils/appwrite.ts";
import { UserAuthObject } from "../utils/interfaces/UserObject.ts";
import { useUserContext } from "../utils/UserContext.tsx";

export const LoginAnonymous = () => {
  const navigate = useNavigate();
  const { getUserData, logoutUser } = useUserContext();

  const handleLogin = async (_prevState: null, queryData: FormData) => {
    const username = queryData.get("username") as string;
    if (!username) return "Please fill all the fields.";
    await logoutUser();

    try {
      await account.createAnonymousSession();
      await account.updateName(username);
      const newAccount = (await account.get()) as UserAuthObject;
      await getUserData(newAccount);
      navigate("/");
    } catch (e) {
      return "Invalid email/password.";
    }
  };

  const [message, formAction] = useActionState(handleLogin, null);

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/img/background.svg')] bg-cover">
      <section
        className={
          "h-full md:h-auto md:w-auto p-8 flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md text-center gap-4"
        }
      >
        <h2>Welcome!</h2>
        <h3>
          We respect your privacy and that's <br />
          why having a temporary anonymous <br />
          account is respected.
        </h3>
        <h4 className={"text-red-500"}>{message}</h4>
        <form className={"flex flex-col gap-4"} action={formAction}>
          <input
            type="text"
            name={"username"}
            placeholder="Enter your username"
            required={true}
          />
          <Link to={"/login"}>Log in with normal account</Link>
          <button type={"submit"} className={"w-full"}>
            Create a temporary anonymous account
          </button>
          <span>
            Need an account?&nbsp;
            <Link to={"/register"}>Register</Link>
          </span>
        </form>
      </section>
    </main>
  );
};
