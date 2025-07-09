import redisClient from "../config/redis.js";

export default function registerSocketHandlers(io, socket) {
  // 🔸 Host se une a la sesión (actualizado)
  socket.on("host-join", async (sessionId) => {
    const exists = await redisClient.exists(`sessions:active:${sessionId}`);
    if (!exists) {
      socket.emit("error", "Session does not exist");
      return;
    }

    // Obtener datos del quiz
    const quizData = await redisClient.hGetAll(`quizzes:${sessionId}`);
    if (!quizData.questions) {
      console.log("Errror happened with Redis");
      socket.emit("error", "Quiz data not found");
      return;
    }

    socket.join(sessionId);
    console.log(`Host joined session ${sessionId}`);

    // Send data from quiz to host
    socket.emit("quiz-data", {
      ...quizData,
      questions: JSON.parse(quizData.questions),
    });

    socket.emit("host-joined", { sessionId });

    const participants = await redisClient.sMembers(
      `sessions:waiting:${sessionId}`
    );
    socket.emit("participants-list", participants);
  });

  // 🔸 Nueva función: Obtener pregunta actual
  socket.on("get-current-question", async (sessionId) => {
    const session = await redisClient.hGetAll(`sessions:active:${sessionId}`);
    const quizData = await redisClient.hGetAll(`quizzes:${sessionId}`);

    if (!session || !quizData) {
      socket.emit("error", "Session or quiz not found");
      return;
    }

    const questions = JSON.parse(quizData.questions);
    const currentQuestion = questions[session.currentQuestion];

    socket.emit("current-question", {
      ...currentQuestion,
      questionIndex: parseInt(session.currentQuestion),
      timeRemaining: parseInt(session.timeRemaining),
    });
  });

  // 🔸 Participante se une a la sesión
  socket.on("participant-join", async ({ sessionId, name }) => {
    const exists = await redisClient.exists(`sessions:active:${sessionId}`);
    if (!exists) {
      socket.emit("error", "Session does not exist");
      return;
    }

    const participantId = `user_${Date.now()}`;
    socket.join(sessionId);

    // Guardar en sala de espera
    await redisClient.sAdd(`sessions:waiting:${sessionId}`, participantId);

    // Notificar al host y otros participantes
    socket.to(sessionId).emit("participant-joined", {
      id: participantId,
      name,
    });

    // Confirmación al participante
    socket.emit("joined", {
      participantId,
      sessionId,
      name,
    });

    console.log(`Participant ${participantId} joined session ${sessionId}`);
  });

  // 🔸 Iniciar el quiz
  socket.on("start-quiz", async (sessionId) => {
    const exists = await redisClient.exists(`sessions:active:${sessionId}`);
    if (!exists) {
      socket.emit("error", "Session does not exist");
      return;
    }

    await redisClient.hSet(`sessions:active:${sessionId}`, "status", "playing");

    io.to(sessionId).emit("quiz-started");
    console.log(`Quiz started in session ${sessionId}`);
  });

  // 🔸 Cambiar de pregunta
  socket.on(
    "question-changed",
    async ({ sessionId, questionIndex, timeRemaining }) => {
      const exists = await redisClient.exists(`sessions:active:${sessionId}`);
      if (!exists) {
        socket.emit("error", "Session does not exist");
        return;
      }

      await redisClient.hSet(`sessions:active:${sessionId}`, {
        currentQuestion: questionIndex,
        timeRemaining: timeRemaining ?? 30,
      });

      io.to(sessionId).emit("question-changed", {
        questionIndex,
        timeRemaining: timeRemaining ?? 30,
      });

      console.log(
        `Question changed to ${questionIndex} in session ${sessionId}`
      );
    }
  );

  // 🔸 Recibir respuesta de participante
  socket.on(
    "answer-submitted",
    async ({ sessionId, questionIndex, participantId, answer }) => {
      const answersKey = `answers:${sessionId}:${questionIndex}`;

      await redisClient.hSet(answersKey, participantId, answer);

      // Confirmar al participante
      socket.emit("answer-received", {
        participantId,
        questionIndex,
        answer,
      });

      // Notificar al host
      socket.to(sessionId).emit("answer-received", {
        participantId,
        questionIndex,
        answer,
      });

      console.log(
        `Answer received from ${participantId} in session ${sessionId} for question ${questionIndex}`
      );
    }
  );

  // 🔸 Terminar el quiz
  socket.on("finish-quiz", async (sessionId) => {
    const exists = await redisClient.exists(`sessions:active:${sessionId}`);
    if (!exists) {
      socket.emit("error", "Session does not exist");
      return;
    }

    await redisClient.hSet(
      `sessions:active:${sessionId}`,
      "status",
      "finished"
    );

    io.to(sessionId).emit("quiz-finished");
    console.log(`Quiz finished in session ${sessionId}`);
  });

  // 🔸 Manejo de desconexiones
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
}
