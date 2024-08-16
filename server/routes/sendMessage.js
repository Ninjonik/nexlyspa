import express from "express";
import {
  Client,
  Databases,
  Permission,
  Role,
  ID,
  Account,
} from "node-appwrite";

const router = express.Router();

router.post("/sendMessage", async (req, res) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);

  const jwtClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

  const jwtDatabases = new Databases(jwtClient);
  const jwtAccount = new Account(jwtClient);

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
      process.env.APPWRITE_DATABASE,
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
      process.env.APPWRITE_DATABASE,
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
