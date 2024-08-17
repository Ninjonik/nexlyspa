import express from "express";
import { RoomServiceClient } from "livekit-server-sdk";
import { Client, Databases, Account } from "node-appwrite";
import "dotenv/config";

const router = express.Router();

router.get("/checkCallStatus", async (req, res) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);

  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { roomId, jwt } = req.body;
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

    if (!room || !room.users.some((user) => user.$id === account.$id)) {
      return res.json({
        success: false,
        message:
          "Room with the specified room code does exist or user is not in the specified room.",
      });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;
    const roomService = new RoomServiceClient(wsUrl, apiKey, apiSecret);

    const participants = await roomService.listParticipants(roomId);
    let status = true;

    if (participants.length === 0) {
      console.log(roomId, "participants count is 0");
      try {
        await database.updateDocument(
          process.env.APPWRITE_DATABASE,
          "rooms",
          roomId,
          {
            call: false,
          },
        );
        status = false;
      } catch (error) {
        console.log("Error setting call to false:", error);
        return res.json({
          success: false,
          message: "There has been an error while setting call to false...",
        });
      }
    }

    return res.json({
      success: true,
      message: "Call has been successfully checked.",
      newCallStatus: status,
    });
  } catch (err) {
    console.log(roomId, "doesn't exist");
    return res.json({
      success: false,
      message: "Room with the specified room code does not exist.",
    });
  }
});

export default router;
