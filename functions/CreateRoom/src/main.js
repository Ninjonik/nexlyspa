import { Client, Databases, Account, Permission, Role } from "node-appwrite";
import { generate } from "random-words";
import { functions } from "../../../src/utils/appwrite.js";
import { ExecutionMethod } from "appwrite";

const generateUniqueRoomCode = async () => {
  let generatedCode = "";
  let codeExists = true;

  while (codeExists) {
    // Generate a new 6-7 character long code (based off random words)
    generatedCode = generate({ minLength: 6, maxLength: 7 });

    // Check if the code already exists in the database
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
    if (!response.success || !response.status) {
      /* Code does not exist, so end the loop */
      codeExists = false;
      continue;
    }
    codeExists = true;
  }

  return generatedCode;
};

export default async ({ req, res }) => {
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

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const jwt = body?.jwt;
    const roomName = body?.roomName;
    const roomDescription = body?.roomDescription;
    const roomAvatar = body?.roomAvatar;

    if (!jwt || !roomName || !roomDescription || !roomAvatar)
      return res.json({
        success: false,
        message: "Some of the required parameters is missing.",
      });

    let account;

    try {
      jwtClient.setJWT(jwt);
      account = await jwtAccount.get();
      if (!account || !account.$id) {
        return res.json({
          success: false,
          message: "Invalid JWT",
        });
      }
    } catch (e) {
      return res.json({
        success: false,
        message: "Invalid JWT",
      });
    }

    try {
      const generatedCode = await generateUniqueRoomCode();

      const newUser = await database.updateDocument(
        "nexly",
        "users",
        account.$id,
        {
          room: {
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
          },
        },
      );

      if (newUser && newUser.room && newUser.room.$id) {
        return res.json({
          success: true,
          message: "Successfully created a new room!",
          newUser: newUser,
          generatedCode: generatedCode,
        });
      }
      return res.json({
        success: false,
        message: "Unknown error.",
      });
    } catch (err) {
      return res.json({
        success: true,
        message: "Cannot create a room with specified arguments...",
      });
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
