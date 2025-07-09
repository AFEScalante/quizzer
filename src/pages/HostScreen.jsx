import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { NeoBtn } from "../components/NeoBtn";

export default function HostScreen() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // 1. Obtener el quiz del localStorage
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    const quizToUse = savedQuizzes.find((q) => q.id === parseInt(quizId));

    if (!quizToUse) {
      alert("Quiz not found");
      navigate("/");
      return;
    }

    setQuizData(quizToUse);

    // Si ya hay una sesión activa, no hacer nada más
    if (sessionId !== "") {
      return;
    }

    // 2. Crear la sesión en el backend
    const createSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizId,
            quizData: quizToUse,
          }),
        });

        const { sessionId } = await response.json();
        setSessionId(sessionId);
      } catch (error) {
        console.log("Error creating session:", error);
      }
    };

    createSession();
  }, [quizId, sessionId, navigate]);

  if (sessionId === "") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold animate-pulse">
          Creating session...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      {quizData?.title && (
        <h1 className="text-xl font-bold mb-4">{quizData.title}</h1>
      )}
      <h2 className="text-xl font-bold mb-4">Room: {sessionId}</h2>

      <div className="mb-8 p-4 bg-white rounded-lg">
        <QRCodeSVG
          value={`${window.location.origin}/join/${sessionId}`}
          size={200}
        />
      </div>
      <NeoBtn className=" bg-green-500  hover:bg-green-600 mb-4">
        Start Quiz
      </NeoBtn>
      <div className="w-full max-w-md">
        <h2 className="text-lg font-semibold mb-3">
          Participants ({participants.length})
        </h2>
        <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
          {participants.map((p, i) => (
            <div key={i} className="flex items-center p-2 border-b">
              <div className="bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                {i + 1}
              </div>
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
