import express from "express";
import "dotenv/config";
import { database, jwtAccount, jwtClient } from "../common.js";
import { Permission, Role } from "node-appwrite";

const router = express.Router();

router.post("/becomeAdmin", async (req, res) => {
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

    if (room && room.admin && room.admin?.$id) {
      return res.json({
        success: false,
        message: "There is already an admin in this group.",
      });
    }

    await database.updateDocument(
      process.env.APPWRITE_DB_NAME,
      "rooms",
      roomId,
      {
        admin: account.$id,
      },
      [
        Permission.read(Role.user(account.$id)),
        Permission.update(Role.user(account.$id)),
      ],
    );
    return res.json({
      success: true,
      message: "Room's admin role was successfully given.",
    });
  } catch (err) {
    console.log(err);
    console.log(roomId, "doesn't exist", "BA");
    return res.json({
      success: false,
      message: "Room with the specified room code does not exist.",
    });
  }
});

export default router;
