import express from "express";
import { Permission, Role } from "node-appwrite";
import "dotenv/config";
import { database, jwtAccount, jwtClient } from "../common.js";
import { checkRoom } from "./checkRoom.js";

const router = express.Router();

router.post("/joinRoom", async (req, res) => {
  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { jwt, roomId } = req.body;

  if (!jwt || !roomId) {
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
    const result = await checkRoom(roomId, jwt);
    if (result !== "exists") {
      return res.json({
        success: false,
        message:
          "Room with the specified code does not exist or it is currently closed.",
      });
    }

    const roomData = await database.getDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
    );

    const newRoomUsers = roomData?.users
      ? [...roomData.users, account.$id]
      : [account.$id];
    const userPermissions = [Permission.read(Role.user(account.$id))];
    const newRoomPermissions =
      roomData?.$permissions && roomData?.$permissions.length > 0
        ? [...roomData.$permissions, ...userPermissions]
        : userPermissions;

    const newRoom = await database.updateDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
      {
        users: newRoomUsers,
      },
      newRoomPermissions,
    );

    if (newRoom) {
      return res.json({
        success: true,
        message: "Successfully joined a new room!",
        newRoom: newRoom,
        roomId: roomId,
      });
    }
    return res.json({
      success: false,
      message: "Unknown error.",
    });
  } catch (err) {
    console.info(err);
    return res.json({
      success: false,
      message: "Cannot join the room with the specified arguments...",
    });
  }
});

export default router;
