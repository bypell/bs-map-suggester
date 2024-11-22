import Header from "./components/Header"
import LoaderButton from "./components/LoaderButton"
import PlayerIdInput from "./components/PlayerIdInput.jsx"

import { useEffect, useState } from 'react';

export default function App() {
  const [playerId, setPlayerId] = useState('');

  useEffect(() => {
    console.log(playerId);
  }, [playerId]);


  return (
    <>
      <div className="h-screen w-screen bg-dark text-white flex flex-col justify-center items-center">
        <Header />
        <div className="flex-row">
          <PlayerIdInput onInputChange={(text) => setPlayerId(text)} />
          <LoaderButton />
        </div>
      </div>
    </>
  )
}