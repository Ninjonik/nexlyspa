import express from "express";
import { Permission, Role } from "node-appwrite";
import "dotenv/config";
import { database, jwtAccount, jwtClient } from "../common.js";

const router = express.Router();

router.post("/leaveRoom", async (req, res) => {
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
    const roomData = await database.getDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
    );

    let newRoomUsers = [...roomData.users];
    let userIndex = newRoomUsers.findIndex((user) => user.$id === account.$id);

    if (userIndex > -1) {
      newRoomUsers.splice(userIndex, 1);
    }

    let newRoomDataPermissions = [...roomData.$permissions];
    const userPermissions = [Permission.read(Role.user(account.$id))];
    for (let i = 0; i < userPermissions.length; i++) {
      const userPermission = userPermissions[i];
      const index = newRoomDataPermissions.indexOf(userPermission);
      if (index > -1) {
        newRoomDataPermissions.splice(index, 1);
      }
    }

    const newRoom = await database.updateDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
      {
        users: newRoomUsers,
      },
      newRoomDataPermissions,
    );

    // If the room is empty then delete it
    if (!newRoomUsers || newRoomUsers.length === 0) {
      await database.deleteDocument(
        process.env.APPWRITE_DB_NAME,
        "rooms",
        roomId,
      );
    }

    if (newRoom) {
      return res.json({
        success: true,
        message: "Successfully left the new room.",
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
      message: "Cannot leave the room with the specified arguments...",
    });
  }
});

export default router;
