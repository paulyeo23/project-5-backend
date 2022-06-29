import cookieParser from "cookie-parser";
import express from "express";
import methodOverride from "method-override";
import bindRoutes from "./routes.mjs";
import cors from "cors";
import { Server } from "socket.io";
import { WebSocketServer, WebSocket } from "ws";
import http, { createServer } from "http";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Initialise Express instance
const app = express();
// Set CORS headers
app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  }),
);
// Set the Express view engine to expect EJS templates
app.set("view engine", "ejs");
// Bind cookie parser middleware to parse cookies in requests
app.use(cookieParser());
// Bind Express middleware to parse request bodies for POST requests
app.use(express.urlencoded({ extended: false }));
// Bind Express middleware to parse JSON request bodies
app.use(express.json());
// Bind method override middleware to parse PUT and DELETE requests sent as POST requests
app.use(methodOverride("_method"));
// Expose the files stored in the public folder
app.use(express.static("public"));
// Bind route definitions to the Express application
bindRoutes(app);

// Set Express to listen on the given port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.info(`Server running on port: ${PORT}`));

const server = createServer(app);
const webSocketServer = new WebSocketServer({ server });
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
server.listen(3002);

webSocketServer.on("connection", (webSocket) => {
  console.info("Total connected clients:", webSocketServer.clients.size);

  app.locals.clients = webSocketServer.clients;
});
