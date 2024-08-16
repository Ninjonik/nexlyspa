import express from "express";
import { Client, Databases, Account } from "node-appwrite";

const router = express.Router();

router.patch("/startCall", async (req, res) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);

  const { jwt, roomId } = req.body;

  if (!roomId || !jwt) {
    return res.json({
      success: false,
      message: "Some of the required parameters is missing.",
    });
  }

  const jwtClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

  const jwtAccount = new Account(jwtClient);

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
    const room = await database.getDocument(
      process.env.APPWRITE_DATABASE,
      "rooms",
      roomId,
    );

    if (
      !room ||
      (room && room?.call) ||
      !room.users.some((user) => user.$id === account.$id)
    ) {
      return res.json({
        success: false,
        message:
          "Room with the specified room code does exist or user is not in the specified room or there is an already ongoing call in the room.",
      });
    }

    await database.updateDocument(
      process.env.APPWRITE_DATABASE,
      "rooms",
      roomId,
      {
        call: true,
      },
    );

    return res.json({
      success: true,
      message: "Successfully initiated a call in the room.",
    });
  } catch (err) {
    console.info(roomId, "doesn't exist");
    return res.json({
      success: false,
      message: "Room with the specified room code does not exist.",
    });
  }
});

export default router;
