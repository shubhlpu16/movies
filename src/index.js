require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const webpush = require("web-push");

app.use(cors());
app.use(express.json());

// const subDatabase = [];
const subDatabase = {};

// Example route to demonstrate middleware usage
app.get("/", (req, res) => {
  res.send("This is socket for shoowflix");
});

io.on("connection", (socket) => {
  console.log("Connected to server");

  socket.on("join", async (userId) => {
    console.log(`User ${userId} joined`);
    socket.join(userId); // Join the user to a room with their userId
  });

  socket.on("sendNotification", ({ validUsers, commentId }) => {
    try {
      validUsers.forEach((user) => {
        console.log(`Sending notification to user ${user.id}`);
        io.to(user.id).emit("notification", {
          type: "mention",
          message: `You were mentioned in a comment by @${user.userName}`,
          commentId: commentId,
          createdAt: new Date(),
        });
      });
    } catch (error) {
      console.error("Error emitting notifications:", error);
    }
  });
});

const apiKeys = {
  pubKey:
    "BNCR_N209rz2iw20xIKTK5KZHr8Dd8uMZJaBlAXuCajqAy5lFLUVzraMIWozdMbiTqRkw6LglstMkCpYQyPmNa8",
  privKey: "HXZ2m2tDbU7XOV0b6CX0zHDFds11PBADBNx9Puf05rU",
};

webpush.setVapidDetails(
  "mailto:shubh.lpu16@gamil.com",
  apiKeys.pubKey,
  apiKeys.privKey
);

app.post("/api/save-subscription", (req, res) => {
  // console.log("🚀 ~ app.post ~ req:", req)
  const  {subscription, userId} = req.body;
  subDatabase[userId] = subscription;
  // subDatabase.push(req.body);
  res.status(200).json({ status: "Success", message: "Subscription saved!" });
});

app.post("/api/send-notification", (req, res) => {
  console.log(subDatabase)
  if (subDatabase[req.body.userId]) {
    // console.log("🚀 ~ app.post ~ subDatabase:", subDatabase)
    webpush
      .sendNotification(subDatabase[req.body.userId], req.body.message)
      .then(() => {
        res.status(200).send({
          status: "Success",
          message: "Message sent to push service",
        });
      })
      .catch((error) => {
        res.status(500).json({ status: "Error", message: error.toString() });
      });
  } else {
    res
      .status(400)
      .json({ status: "Error", message: "No subscriptions found" });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = app;
