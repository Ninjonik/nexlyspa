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
      const room = await database.getDocument("nexly", "rooms", roomId);
      if(room?.closed){
        console.log(roomId, "closed");
        return res.json({
          success: true,
          message: "Room with the specified room code is currently closed.",
          status: false,
        });
      }
      console.log(roomId, "exists");
      return res.json({
        success: true,
        message: "Room with the specified room code does exist.",
        status: true,
      });
    } catch (err) {
      console.log(roomId, "doesn't exist");
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
