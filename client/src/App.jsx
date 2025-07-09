import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import QuestionBuilder from "./pages/QuestionBuilder";
import { useEffect, useState } from "react";
import HostScreen from "./pages/HostScreen";
import ParticipantScreen from "./pages/ParticipantScreen";

function App() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    setQuizzes(savedQuizzes);
  }, []);

  const handleSubmit = (quizData) => {
    const newQuizzes = [...quizzes];
    const existingIndex = newQuizzes.findIndex((q) => q.id === quizData.id);

    if (existingIndex !== -1) {
      // Actualizar quiz existente
      newQuizzes[existingIndex] = quizData;
    } else {
      // Crear nuevo quiz
      newQuizzes.push({ ...quizData, id: Date.now() });
    }

    localStorage.setItem("quizzes", JSON.stringify(newQuizzes));
    setQuizzes(newQuizzes);
    navigate("/");
  };

  const handleDeleteQuiz = (id) => {
    const newQuizzes = quizzes.filter((quiz) => quiz.id !== id);
    localStorage.setItem("quizzes", JSON.stringify(newQuizzes));
    setQuizzes(newQuizzes);
  };

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home quizzes={quizzes} onDelete={handleDeleteQuiz} />}
        />
        <Route
          path="/quiz-edit"
          element={<QuestionBuilder onSubmit={handleSubmit} />}
        />
        <Route
          path="/quiz-edit/:quizId"
          element={
            <QuestionBuilder quizzes={quizzes} onSubmit={handleSubmit} />
          }
        />
        <Route path="/quiz-host/:quizId" element={<HostScreen />} />
        <Route path="/session/:sessionId" element={<ParticipantScreen />} />
      </Routes>
    </>
  );
}

export default App;
