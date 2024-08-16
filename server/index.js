import express from "express";
import checkCallStatus from "./routes/checkCallStatus.js";
import checkRoom from "./routes/checkRoom.js";
import createRoom from "./routes/createRoom.js";
import deleteUser from "./routes/deleteUser.js";
import getParticipantToken from "./routes/getParticipantToken.js";
import joinRoom from "./routes/joinRoom.js";
import leaveRoom from "./routes/leaveRoom.js";
import sendMessage from "./routes/sendMessage.js";
import startCall from "./routes/startCall.js";

const app = express();
const port = 3050;

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(checkCallStatus);
app.use(checkRoom);
app.use(createRoom);
app.use(deleteUser);
app.use(getParticipantToken);
app.use(joinRoom);
app.use(leaveRoom);
app.use(sendMessage);
app.use(startCall);
