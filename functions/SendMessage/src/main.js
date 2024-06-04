import {
  Client,
  Databases,
  Permission,
  Role,
  ID,
  Account,
} from "node-appwrite";

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
    const message = body?.message;
    const attachments = body?.attachments;
    const roomId = body?.roomId;
    if (!roomId || !jwt || (!message && !attachments && attachments.length < 1))
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
      const roomData = await jwtDatabases.getDocument(
        database,
        "rooms",
        roomId,
      );

      if (!roomData)
        return res.json({
          success: false,
          message: "Specified room does not exist / user is not in the room.",
        });

      let permissions = [];
      let userInRoom = false;
      roomData.users.map((user) => {
        permissions.push(Permission.read(Role.user(user.$id)));
        if (user.$id === account.$id) userInRoom = true;
      });

      if (!userInRoom)
        return res.json({
          success: false,
          message: "User is not in the room.",
        });

      const result = await jwtDatabases.createDocument(
        database,
        "messages",
        ID.unique(),
        {
          room: roomId,
          author: account.$id,
          message: message,
          attachments: attachments,
        },
        permissions,
      );

      console.log("RESULT:", result);

      // return res.json({
      //   success: false,
      //   message: "Message successfully sent!",
      //   data: result,
      // });
    } catch (error) {
      console.error("Error creating a message:", error);
      return Response.json(
        { error: "There has been an error while processing your request" },
        { status: 500 },
      );
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
