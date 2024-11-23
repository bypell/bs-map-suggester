import Header from "./components/Header"
import LoaderButton from "./components/LoaderButton"
import PlayerIdInput from "./components/PlayerIdInput.jsx"

import { useEffect, useState } from 'react';

export default function App() {
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClick() {
    console.log(playerId);
    setLoading(true);

  }

  return (
    <>
      <div className="h-screen w-screen bg-dark text-white flex flex-col justify-center items-center">
        <Header />
        <div className="flex flex-row">
          <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} disabled={loading} />
          <LoaderButton onClick={handleClick} disabled={loading} />
        </div>
        <div className={`mt-10 ${loading ? 'block' : 'hidden'}`}>
          <div
            className="w-8 h-8 rounded-full animate-spin absolute  border-4 border-solid border-gray-400 border-t-transparent">
          </div>
        </div>
      </div>
    </>
  )
}