"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { account } from "../utils/appwrite.ts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { pageTransitionOptions } from "../utils/constants.ts";

export const Verify = () => {
  const [message, setMessage] = useState<string>("");
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const userId = query.get("userId");
  const secret = query.get("secret");
  const expire = query.get("expire");
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!userId || !secret || !expire) return;

    setMessage("Verifying your user account...");

    try {
      await account.updateVerification(userId, secret);
      navigate("/home");
    } catch (e) {
      setMessage(
        "Invalid verification secret or user account or your verification link has already expired. Please request a new one.",
      );
    }

    setTimeout(() => {
      navigate("/home");
    }, 3000);
  };

  const verifyAccount = async () => {
    try {
      await account.createVerification(
        (import.meta.env.VITE_PUBLIC_HOSTNAME ?? "http://localhost:3000") +
          "/register/verify",
      );
      setMessage(
        "Success! Please check your email to proceed with verification.",
      );
    } catch (e) {
      setMessage("You cannot verify already verified or an anonymous account!");
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <main className="w-screen h-screen flex justify-center items-center bg-[url('/img/background.svg')] bg-cover">
      <motion.section
        className={
          "h-full md:h-auto md:w-auto p-8 flex flex-col justify-center items-center bg-base-100 rounded-lg shadow-md text-center gap-4"
        }
        {...pageTransitionOptions}
      >
        <h2>Email Verification!</h2>
        <h3>You verifying your email grants you some additional bonuses!</h3>
        <h4 className={"text-teal-500 text-semibold"}>{message}</h4>
        {!userId && (
          <button onClick={verifyAccount}>Verify your account</button>
        )}
        <Link to={"/"}>Back</Link>
      </motion.section>
    </main>
  );
};
