import { useState } from 'react';
import Spinner from '../common/Spinner.jsx'
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";

import { getMapSuggestionsForUser } from '../../services/suggestMapsService';

export default function PlayerSelectPage() {
    const [playerId, setPlayerId] = useState('');
    const [loading, setLoading] = useState(false);

    function handleClick() {
        console.log(playerId);
        setLoading(true);
        getMapSuggestionsForUser(playerId)
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
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