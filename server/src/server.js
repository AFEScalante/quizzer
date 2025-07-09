import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

import routes from "./routes/index.js";
import sessionRoutes from "./routes/session.js";

import registerSocketHandlers from "./socket/index.js";

const app = express();

// Configuración de Express
app.disable("x-powered-by");

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // ⚠️ Cambiar en producción
  },
});

app.use(
  cors({
    origin: "http://localhost:5173", // Reemplaza con tu URL de frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());

// API Routes
app.use("/", routes);
app.use("/session", sessionRoutes);

// Socket
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  registerSocketHandlers(io, socket);
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Socket.io endpoint: http://localhost:${PORT}/socket.io/`);
});
