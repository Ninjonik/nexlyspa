import express from "express";
import "dotenv/config";
import { database, users } from "../common.js";

const router = express.Router();

router.delete("/deleteUser", async (req, res) => {
  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { userId, provider } = req.body;

  console.log(userId); // Logging the removedUserId for debugging purposes

  // Only delete anonymous accounts
  if (provider !== "anonymous") {
    return res.json({
      success: true,
      message: "Not deleting non-anonymous account.",
    });
  }

  try {
    await database.deleteDocument(
      process.env.APPWRITE_DB_NAME,
      "users",
      userId,
    );
  } catch (err) {
    console.log(`Can't delete user record.`);
  }

  try {
    await users.delete(userId);
  } catch (e) {
    console.log(`Can't delete user account.`);
  }

  return res.json({
    success: true,
    message: "User record deleted successfully",
  });
});

export default router;
