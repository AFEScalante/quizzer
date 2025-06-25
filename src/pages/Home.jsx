import NewQuiz from "../components/NewQuizBtn";
import QuizCard from "../components/QuizCard";

export default function Home({ quizzes }) {
  return (
    <main className="m-auto max-w-xl p-4">
      <p className="text-center text-gray-700 text-xl mb-4">
        What's your plan today?
      </p>
      <NewQuiz />
      {quizzes.length > 0 && (
        <>
          <h3 className="text-md font-bold mt-14 mb-4">Your Quizzes</h3>
          <ul className="space-y-4">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <QuizCard quiz={quiz} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
