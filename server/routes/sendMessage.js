import express from "express";
import { Permission, Role, ID } from "node-appwrite";
import "dotenv/config";
import { database, jwtAccount, jwtClient, jwtDatabases } from "../common.js";

const router = express.Router();

router.post("/sendMessage", async (req, res) => {
  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { jwt, message, attachments, roomId } = req.body;

  if (!roomId || !jwt || (!message && !attachments && attachments.length < 1)) {
    return res.json({
      success: false,
      message: "Some of the required parameters is missing.",
    });
  }

  let account;

  try {
    jwtClient.setJWT(jwt);
    account = await jwtAccount.get();
    if (!account || !account.$id) {
      return res.json({
        success: false,
        message: "Invalid Account JWT",
      });
    }
  } catch (e) {
    return res.json({
      success: false,
      message: "Invalid JWT Token",
    });
  }

  try {
    const roomData = await jwtDatabases.getDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
    );

    if (!roomData) {
      return res.json({
        success: false,
        message: "Specified room does not exist / user is not in the room.",
      });
    }

    let permissions = [];
    let userInRoom = false;
    roomData.users.map((user) => {
      permissions.push(Permission.read(Role.user(user.$id)));
      if (user.$id === account.$id) userInRoom = true;
    });

    if (!userInRoom) {
      return res.json({
        success: false,
        message: "User is not in the room.",
      });
    }

    const result = await database.createDocument(
      process.env.APPWRITE_DB_NAME,
      "messages",
      ID.unique(),
      {
        room: roomId,
        author: account.$id,
        message: message,
        attachments: attachments,
      },
      permissions,
    );

    return res.json({
      success: true,
      message: "Message successfully sent!",
      data: result,
    });
  } catch (error) {
    console.info("Error creating a message:", error);
    return res.json({
      success: false,
      message: "There has been an error while processing your request",
    });
  }
});

export default router;
