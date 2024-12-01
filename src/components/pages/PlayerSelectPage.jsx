import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";
import { useMapSuggestions } from '../../hooks/useMapSuggestions';

export default function PlayerSelectPage() {
    const [playerId, setPlayerId] = useState('');
    const { loading, suggestions, error, fetchMapSuggestions } = useMapSuggestions();
    const navigate = useNavigate();

    async function handleClick() {
        console.log(playerId);

        if (!playerId) {
            return;
        }

        await fetchMapSuggestions(playerId);
        navigate(`/suggestions`);
    }

    return (
        <div className="h-screen w-screen relative bg-dark text-white flex flex-col justify-center items-center">
            <Header />
            <div className="flex flex-row">
                <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} disabled={loading} />
                <LoaderButton text="Get Suggestions" onClick={handleClick} disabled={loading} />
            </div>
            <div className={`flex flex-row mt-10 ${loading ? 'block' : 'hidden'}`}>
                <Spinner />
            </div>
            {error && <div className="text-red-500 mt-4">Error: {error.message}</div>}
        </div>
    );
}