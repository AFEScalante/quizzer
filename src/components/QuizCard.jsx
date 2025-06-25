import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  return (
    <Link
      to={`/quiz-edit/${quiz.id}`}
      className="shadow-solid flex justify-between items-center p-4 bg-gray-100 rounded-lg border border-black transition"
    >
      <div>
        <h4 className="text-md font-semibold">{quiz.title}</h4>
        <p className="text-sm text-gray-600">
          {quiz.questions.length} questions
        </p>
      </div>
      <FaArrowRight className="text-gray-900" />
    </Link>
  );
}
