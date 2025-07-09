import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket/socket";

export default function useSession() {
  const { quizId } = useParams();
  const [sessionId, setSessionId] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [participants, setParticipants] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quizToUse = savedQuizzes.find((q) => q.id === parseInt(quizId));

    if (!quizToUse) {
      alert("Quiz not found");
      navigate("/");
      return;
    }

    function participantJoined({ id, name }) {
      console.log(`Participant ${name} with ID ${id} has joined the session.`);
      setParticipants((participant) => [...participant, name]);
    }

    function hostJoined({ sessionId }) {
      console.log(`Host has joined the session with ID: ${sessionId}`);
    }

    setQuizData(quizToUse);

    if (sessionId !== "") {
      return;
    }

    const createSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            quizData: quizToUse,
          }),
        });

        const { sessionId } = await response.json();
        setSessionId(sessionId);
        socket.emit("host-join", sessionId);
        socket.on("participant-joined", participantJoined);
        socket.on("host-joined", hostJoined);
      } catch (error) {
        console.log("Error creating session:", error);
      }
    };

    createSession();
  }, [quizId, sessionId, navigate]);

  return {
    sessionId,
    quizData,
    participants,
  };
}
