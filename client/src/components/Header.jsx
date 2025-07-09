import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="group p-4 transition duration-300 font-mono">
      <Link to="/">
        quizzer
        <span className="block w-0 group-hover:w-18 transition-all duration-200 h-0.5 bg-slate-700"></span>
      </Link>
    </header>
  );
}
