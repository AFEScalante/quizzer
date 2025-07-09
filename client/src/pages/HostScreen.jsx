import { QRCodeSVG } from "qrcode.react";
import { NeoBtn } from "../components/NeoBtn";
import { FaUser } from "react-icons/fa";

import useSession from "../hooks/useSession";

export default function HostScreen() {
  const { sessionId, quizData, participants } = useSession();

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
          value={`${window.location.origin}/quiz-participant/${sessionId}`}
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
        <div className="p-4 max-w-xl flex flex-wrap gap-2">
          {participants.map((p, i) => (
            <div key={i} className="flex items-center">
              <span className="flex bg-amber-200 p-2 text-sm rounded-xl text-amber-700 justify-center items-center gap-1.5">
                {p}
                <FaUser />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
