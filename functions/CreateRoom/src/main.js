import { Client, Databases, Account } from "node-appwrite";

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

  if (req.method === "GET") {
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
      // TODO: Handle stuff
    } catch (err) {
      return res.json({
        success: true,
        message: "Cannot create a room with specified arguments...",
        status: false,
      });
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
