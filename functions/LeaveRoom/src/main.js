import {
  Client,
  Databases,
  Account,
  Functions,
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
    const roomCode = body?.roomCode;

    if (!jwt || !roomCode)
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
      const roomData = await database.getDocument(
        process.env.APPWRITE_DATABASE,
        "rooms",
        roomCode,
      );

      let newRoomUsers = [...roomData.users];
      let userIndex = newRoomUsers.findIndex(
        (user) => user.$id === account.$id,
      );

      if (userIndex > -1) {
        newRoomUsers.splice(userIndex, 1);
      }

      // If the room is empty then delete it
      if (!newRoomUsers || newRoomUsers.length === 0) {
        await database.deleteDocument(
          process.env.APPWRITE_DATABASE,
          "rooms",
          roomCode,
        );
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
        process.env.APPWRITE_DATABASE,
        "rooms",
        roomCode,
        {
          users: newRoomUsers,
        },
        newRoomDataPermissions,
      );

      if (newRoom) {
        return res.json({
          success: true,
          message: "Successfully joined a new room!",
          newRoom: newRoom,
          roomCode: roomCode,
        });
      }
      return res.json({
        success: false,
        message: "Unknown error.",
      });
    } catch (err) {
      console.log(err);
      return res.json({
        success: true,
        message: "Cannot join the room with the specified arguments...",
      });
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
