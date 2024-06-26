import {
  Client,
  Databases,
  Account,
  Functions,
  ExecutionMethod,
  Permission,
  Role,
} from "node-appwrite";

export default async ({ req, res }) => {
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

  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    const jwt = body?.jwt;
    const roomId = body?.roomId;

    if (!jwt || !roomId)
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
      const result = await functions.createExecution(
        "checkRoom",
        JSON.stringify({
          roomId: roomId,
        }),
        false,
        undefined,
        ExecutionMethod.GET,
      );

      const response = JSON.parse(result.responseBody);
      if (!response.success) {
        return res.json({
          success: false,
          message:
            "Room with the specified code does not exist or it is currently closed.",
        });
      }

      const roomData = await database.getDocument(
        process.env.APPWRITE_DATABASE,
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
        process.env.APPWRITE_DATABASE,
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
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
