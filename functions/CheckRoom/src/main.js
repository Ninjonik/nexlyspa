import { Client, Databases } from "node-appwrite";

export default async ({ req, res }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT)
    .setKey(process.env.APPWRITE_KEY);

  const database = new Databases(client);

  if (req.method === "GET") {
    const body = JSON.parse(req.body);
    const roomId = body?.roomId;
    if (!roomId)
      return res.json({
        success: false,
        message: "Some of the required parameters is missing.",
      });

    try {
      const room = await database.getDocument(
        process.env.APPWRITE_DATABASE,
        "rooms",
        roomId,
      );
      if (room?.closed) {
        console.log(roomId, "closed");
        return res.json({
          success: false,
          message: "Room with the specified room code is currently closed.",
        });
      }
      console.log(roomId, "exists");
      return res.json({
        success: true,
        message: "Room with the specified room code exists.",
      });
    } catch (err) {
      console.log(roomId, "doesn't exist");
      return res.json({
        success: false,
        message: "Room with the specified room code does not exist.",
      });
    }
  }

  return res.json({
    success: false,
    message: "Invalid Method",
  });
};
