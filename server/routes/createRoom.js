import express from "express";
import { Permission, Role, ExecutionMethod } from "node-appwrite";
import { generate } from "random-words";
import "dotenv/config";
import { database, jwtAccount, jwtClient } from "../common.js";
import { checkRoom } from "./checkRoom.js";

const router = express.Router();

const generateUniqueRoomId = async () => {
  let generatedCode = "";
  let codeExists = true;

  while (codeExists) {
    generatedCode = generate({ minLength: 6, maxLength: 7 });

    const result = await checkRoom(generatedCode);

    if (result === "doesntExist") {
      codeExists = false;
    }
  }

  return generatedCode;
};

router.post("/createRoom", async (req, res) => {
  if (!req?.body)
    return res.json({
      success: false,
      message: "Invalid payload: no body.",
    });

  const { jwt, roomName, roomDescription, roomAvatar } = req.body;

  if (!jwt || !roomName || !roomDescription || !roomAvatar) {
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
    console.log(e, jwtClient);
    return res.json({
      success: false,
      message: "Invalid JWT Token",
    });
  }

  try {
    const generatedCode = await generateUniqueRoomId();

    const newRoom = {
      $id: generatedCode,
      name: roomName,
      closed: false,
      avatar: roomAvatar,
      description: roomDescription,
      $permissions: [
        Permission.read(Role.user(account.$id)),
        Permission.create(Role.user(account.$id)),
        Permission.update(Role.user(account.$id)),
        Permission.delete(Role.user(account.$id)),
        Permission.read(Role.any()),
      ],
    };

    const oldUser = await database.getDocument(
      process.env.APPWRITE_DB_NAME,
      "users",
      account.$id,
    );

    const newRooms =
      oldUser?.rooms && oldUser.rooms.length > 0
        ? [...oldUser.rooms, newRoom]
        : [newRoom];

    const newUser = await database.updateDocument(
      process.env.APPWRITE_DB_NAME,
      "users",
      account.$id,
      {
        rooms: newRooms,
      },
    );

    if (newUser) {
      return res.json({
        success: true,
        message: "Successfully created a new room!",
        newUser: newUser,
        roomId: generatedCode,
      });
    }
    return res.json({
      success: false,
      message: "Unknown error.",
    });
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "Cannot create a room with specified arguments...",
    });
  }
});

export default router;
