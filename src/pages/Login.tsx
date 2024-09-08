"use client";

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
// @ts-expect-error erroneous due to outdated react types, will be fixed with react 19
import { useActionState } from "react";
import { account } from "../utils/appwrite.ts";
import { useUserContext } from "../utils/UserContext.tsx";
import { UserAuthObject } from "../utils/interfaces/UserObject.ts";
import { toast } from "react-toastify";
import { pageTransitionOptions } from "../utils/constants.ts";

export const Login = () => {
  const { getUserData, logoutUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async (_prevState: null, queryData: FormData) => {
    const email = queryData.get("email") as string;
    const password = queryData.get("password") as string;
    if (!email || !password) return "Please fill all the fields.";

    const toastId = toast.loading("Logging you in...");
    await logoutUser();
    try {
      await account.createEmailPasswordSession(email, password);
      const newAccount = (await account.get()) as UserAuthObject;
      await getUserData(newAccount);
      toast.update(toastId, {
        render: "Successfully logged you in!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/home");
    } catch (e) {
      toast.update(toastId, {
        render: "Invalid email/password.",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      return "Invalid email/password.";
    }
  };

  const [message, formAction] = useActionState(handleLogin, null);

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/img/background.svg')] bg-cover">
      <motion.section
        className={
          "h-full md:h-auto md:w-auto p-8 flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md text-center gap-4"
        }
        {...pageTransitionOptions}
      >
        <h2>Welcome back!</h2>
        <h3>We're so excited to see you again!</h3>
        <h4 className={"text-red-500"}>{message}</h4>
        <form className={"flex flex-col gap-4"} action={formAction}>
          <input
            type="email"
            name={"email"}
            placeholder="Enter your email"
            required={true}
          />
          <input
            type="password"
            name={"password"}
            placeholder="Enter your password"
            required={true}
          />
          <Link to={"/reset-password"}>Forgot your password?</Link>
          <Link to={"/login/anonymous"}>
            Continue with a one-time anonymous account?
          </Link>
          <button type={"submit"} className={"w-full button"}>
            Log in
          </button>
          <span>
            Need an account?&nbsp;
            <Link to={"/register"}>Register</Link>
          </span>
        </form>
      </motion.section>
    </main>
  );
};
