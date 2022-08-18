import express from "express";
import { createServer } from "http";
import WebSocket from "ws";
import { Low, JSONFile } from "lowdb";

const PORT = 5000;

const app = express();
app.use(express.json({ extended: false }));

const adapter = new JSONFile("db.json");
const db = new Low(adapter);
await db.read();
db.data ||= { phones: [] };

const { phones } = db.data;

const broadcast = (clients, message) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

app.get("/phones", (req, res) => {
  res.status(200).json(phones);
});

app.post("/phones", async (req, res, next) => {
  const phone = phones.push(req.body);
  await db.write();
  broadcast(req.app.locals.clients, JSON.stringify(phones));
  res.json(phones);
});

const server = createServer(app);
server.listen(PORT, () => console.log("SERVER STARTED ON PORT " + PORT));

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  console.log("Connected clients", wss.clients.size);

  app.locals.clients = wss.clients;
});
