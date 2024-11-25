import { useState } from 'react';
import Spinner from '../../components/common/Spinner.jsx'
import Header from "../../components/Header";
import LoaderButton from "../../components/LoaderButton";
import PlayerIdInput from "../../components/PlayerIdInput.jsx";

export default function SelectPlayerPage() {
    const [playerId, setPlayerId] = useState('');
    const [loading, setLoading] = useState(false);

    function handleClick() {
        console.log(playerId);
        setLoading(true);
    }

    return (
        <div className="h-screen w-screen relative bg-dark text-white flex flex-col justify-center items-center">
            <Header />
            <div className="flex flex-row">
                <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} disabled={loading} />
                <LoaderButton text="Get Suggestions" onClick={handleClick} disabled={loading} />
            </div>
            <div className={`absolute mt-[calc(30vh-10px)] ${loading ? 'block' : 'hidden'}`}>
                <Spinner />
            </div>
        </div>
    );
}