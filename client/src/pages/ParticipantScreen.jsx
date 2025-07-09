import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import Box from "../components/Box";

import { socket } from "../socket/socket";
import { NeoBtn } from "../components/NeoBtn";

export default function ParticipantScreen() {
  const { sessionId } = useParams();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("joining");

  useEffect(() => {
    const newSocket = socket;

    function playerJoin() {
      setStatus("playing");
    }

    function joined({ participantId, name, sessionId: id }) {
      setStatus("waiting");
      console.log(
        `Participant ${name} with ID ${participantId} has joined the session ${id}.`
      );
    }

    newSocket.on("quiz-started", playerJoin);
    newSocket.on("joined", joined);

    return () => {
      newSocket.off(playerJoin);
      newSocket.off(joined);
      // Disconnect the socket when the component unmounts
      newSocket.disconnect();
    };
  }, []);

  const onJoin = (e) => {
    e.preventDefault();

    socket.emit("participant-join", {
      sessionId,
      name: name,
    });
  };

  return (
    <main className="m-auto max-w-xl p-4">
      <Box className="max-w-md mx-auto mt-4 border-2">
        {status === "joining" && (
          <div className="flex flex-col mx-auto items-center gap-4">
            <NeoBtn className="self-baseline p-5 bg-[#F4D768]">
              <FaRegClock className="text-4xl text-slate-700" />
            </NeoBtn>
            <h1 className="font-bold text-slate-700">Waiting for the host</h1>
            <p className="text-sm text-slate-600 text-center">
              The quiz hasn't started yet. <br /> Enter your username and hang
              tight!
            </p>
            <form onSubmit={onJoin}>
              <label
                htmlFor="participant-username"
                className="self-start font-semibold text-slate-700 text-sm"
              >
                Your username
              </label>
              <input
                id="participant-username"
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
                maxLength={12}
                className="w-full p-2.5 border rounded-3xl mb-4 bg-pink-200 text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF7A5C] py-2 text-sm flex flex-col shadow-solid justify-center items-center gap-1 rounded-md border-2 border-slate-700 p-2 transition-all text-slate-800"
              >
                Save username
              </button>
            </form>
          </div>
        )}

        {status === "waiting" && (
          <div className="flex flex-col mx-auto items-center gap-4">
            <h2 className="text-xl font-bold">Ready, {name}!</h2>
            <p className="mt-4">Waiting for the host to start the quiz...</p>
            <div className="mt-6">
              <div className="inline-block animate-bounce">
                <div className="w-12 h-12 bg-rose-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {status === "playing" && (
          <div>
            <h2>¡Comienza el quiz!</h2>
            {/* Componente para mostrar preguntas */}
          </div>
        )}
      </Box>
    </main>
  );
}
