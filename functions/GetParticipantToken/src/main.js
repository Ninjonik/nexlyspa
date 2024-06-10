import { AccessToken } from "livekit-server-sdk";
import { Client, Databases, Account } from "node-appwrite";

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);

  if (req.method === "GET") {
    const body = JSON.parse(req.body);
    const roomId = body?.roomId;
    const jwt = body?.jwt;
    if (!roomId || !jwt)
      return res.json({
        success: false,
        message: "Some of the required parameters is missing.",
      });

    const jwtClient = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT);

    const jwtAccount = new Account(jwtClient);

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
        process.env.APPWRITE_DATABASE,
        "rooms",
        roomId,
      );

      if (!room || !room.users.some((user) => user.$id === account.$id))
        return res.json({
          success: false,
          message:
            "Room with the specified room code does exist or user is not in the specified room.",
        });

      const apiKey = process.env.LIVEKIT_API_KEY;
      const apiSecret = process.env.LIVEKIT_API_SECRET;
      // const wsUrl = process.env.LIVEKIT_URL;

      const at = new AccessToken(apiKey, apiSecret, {
        identity: account.name,
        name: account.name,
      });

      at.addGrant({
        room: roomId,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
      });

      return res.json({
        success: true,
        message: "Successfully generated an access token for user.",
        token: await at.toJwt(),
        status: true,
      });
    } catch (err) {
      console.info(roomId, "doesn't exist");
      return res.json({
        success: true,
        message: "Room with the specified room code does not exist.",
        status: false,
      });
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
