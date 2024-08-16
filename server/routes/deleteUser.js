import express from "express";
import { Client, Databases, Users } from "node-appwrite";

const router = express.Router();

router.delete("/deleteUser", async (req, res) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);
  const users = new Users(client);

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
      process.env.APPWRITE_DATABASE,
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
