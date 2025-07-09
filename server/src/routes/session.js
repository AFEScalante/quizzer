import { Router } from "express";
import redisClient from "../config/redis.js";
import { v4 as uuidv4 } from "uuid";

const router = Router();
const SESSION_EXPIRATION_TIME = 3600; // 1 hora en segundos

router.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

// Crear nueva sesión
router.post("/", async (req, res) => {
  const { quizId, quizData } = req.body;

  if (!quizId || !quizData) {
    return res.status(400).json({ error: "Quiz ID and data are required" });
  }

  const sessionId = uuidv4();

  try {
    // Guardar datos del quiz
    await redisClient.hSet(`quizzes:${sessionId}`, {
      title: quizData.title,
      questions: JSON.stringify(quizData.questions), // Almacenar como string
    });

    // Establecer expiración para los datos del quiz
    await redisClient.expire(`quizzes:${sessionId}`, SESSION_EXPIRATION_TIME);

    // Inicializar la sesión
    await redisClient.hSet(`sessions:active:${sessionId}`, {
      quizId,
      currentQuestion: 0,
      timeRemaining: 30,
      status: "waiting",
    });

    // Establecer expiración para la sesión activa
    await redisClient.expire(
      `sessions:active:${sessionId}`,
      SESSION_EXPIRATION_TIME
    );

    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener datos completos del quiz de la sesión
router.get("/:id/quiz", async (req, res) => {
  const { id: sessionId } = req.params;

  try {
    const quizData = await redisClient.hGetAll(`quizzes:${sessionId}`);
    if (!quizData || !quizData.questions) {
      return res.status(404).json({ error: "Quiz not found for this session" });
    }

    // Renovar el TTL al acceder a los datos
    await redisClient.expire(`quizzes:${sessionId}`, SESSION_EXPIRATION_TIME);

    // Parsear las preguntas
    res.json({
      ...quizData,
      questions: JSON.parse(quizData.questions),
    });
  } catch (error) {
    console.error("Error getting quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener estado de la sesión
router.get("/:id", async (req, res) => {
  const { id: sessionId } = req.params;

  const sessionKey = `sessions:active:${sessionId}`;
  const exists = await redisClient.exists(sessionKey);

  if (!exists) {
    return res.status(404).json({ error: "Session not found" });
  }

  const sessionData = await redisClient.hGetAll(sessionKey);
  const participants = await redisClient.sMembers(
    `sessions:waiting:${sessionId}`
  );

  // Renovar el TTL al acceder a la sesión
  await redisClient.expire(sessionKey, SESSION_EXPIRATION_TIME);
  await redisClient.expire(
    `sessions:waiting:${sessionId}`,
    SESSION_EXPIRATION_TIME
  );

  res.json({
    sessionId,
    session: sessionData,
    participants,
  });
});

export default router;
