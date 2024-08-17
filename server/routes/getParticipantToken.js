import express from "express";
import { AccessToken } from "livekit-server-sdk";
import "dotenv/config";
import { database, jwtAccount, jwtClient } from "../common.js";

const router = express.Router();

router.post("/getParticipantToken", async (req, res) => {
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
      process.env.APPWRITE_DB_NAME,
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

    const at = new AccessToken(apiKey, apiSecret, {
      identity: account.name,
      name: account.name,
    });

    at.addGrant({
      room: roomId,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
    });

    return res.json({
      success: true,
      message: "Successfully generated an access token for user.",
      token: await at.toJwt(),
    });
  } catch (err) {
    console.log(roomId, "doesn't exist", "GPT");
    return res.json({
      success: false,
      message: "Room with the specified room code does not exist.",
    });
  }
});

export default router;
