import express from "express";
import "dotenv/config";
import { database } from "../common.js";

const router = express.Router();

export const checkRoom = async (roomId) => {
  try {
    const room = await database.getDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
    );

    if (room?.closed) {
      return "closed";
    }
    return "exists";
  } catch (err) {
    return "doesntExist";
  }
};

router.post("/checkRoom", async (req, res) => {
  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { roomId } = req.body;

  if (!roomId) {
    return res.json({
      success: false,
      message: "Some of the required parameters is missing.",
    });
  }

  const result = await checkRoom(roomId);
  if (result === "closed") {
    return result.json({
      success: false,
      message: "Room with the specified room code is currently closed.",
    });
  } else if (result === "exists") {
    return result.json({
      success: true,
      message: "Room with the specified room code exists.",
    });
  } else {
    return result.json({
      success: false,
      message: "Room with the specified room code does not exist.",
    });
  }
});

export default router;
