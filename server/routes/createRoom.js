import express from "express";
import {
  Client,
  Databases,
  Account,
  Permission,
  Role,
  Functions,
  ExecutionMethod,
} from "node-appwrite";
import { generate } from "random-words";

const router = express.Router();

const generateUniqueRoomId = async (functions) => {
  let generatedCode = "";
  let codeExists = true;

  while (codeExists) {
    generatedCode = generate({ minLength: 6, maxLength: 7 });

    const result = await functions.createExecution(
      "checkRoom",
      JSON.stringify({
        roomId: generatedCode,
      }),
      false,
      undefined,
      ExecutionMethod.GET,
    );

    const response = JSON.parse(result.responseBody);
    if (!response.success) {
      codeExists = false;
    }
  }

  return generatedCode;
};

router.post("/createRoom", async (req, res) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);
  const functions = new Functions(client);

  const jwtClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT);

  const jwtAccount = new Account(jwtClient);

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
    return res.json({
      success: false,
      message: "Invalid JWT Token",
    });
  }

  try {
    const generatedCode = await generateUniqueRoomId(functions);

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
      process.env.APPWRITE_DATABASE,
      "users",
      account.$id,
    );

    const newRooms =
      oldUser?.rooms && oldUser.rooms.length > 0
        ? [...oldUser.rooms, newRoom]
        : [newRoom];

    const newUser = await database.updateDocument(
      process.env.APPWRITE_DATABASE,
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
