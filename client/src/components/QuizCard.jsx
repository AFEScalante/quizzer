import { FaArrowRight } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";

import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  return (
    <div className="shadow-solid-only flex justify-between items-center p-4 bg-gray-100 rounded-lg border border-black transition">
      <div>
        <h4 className="text-md font-semibold">{quiz.title}</h4>
        <p className="text-sm text-gray-600">
          {quiz.questions.length} questions
        </p>
      </div>
      <div className="flex items-center">
        <Link to={`/quiz-edit/${quiz.id}`} className="text-xl">
          <LuPencilLine className="text-gray-900 mr-4 hover:animate-pulse" />
        </Link>
        <Link to={`/quiz-host/${quiz.id}`}>
          <FaArrowRight className="text-gray-900 hover:animate-pulse" />
        </Link>
      </div>
    </div>
  );
}
