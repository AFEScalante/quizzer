import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NewQuiz() {
  return (
    <Link className="rounded-md" to="/quiz-edit">
      <span className="flex flex-col shadow-solid justify-center items-center gap-1 rounded-md border-2 bg-violet-300 border-black p-4 transition-all">
        <FaPlus className="text-xl" />
        <h3 className="text-lg font-bold">Create New Quiz</h3>
        <span>Start fresh with your own questions</span>
      </span>
    </Link>
  );
}
