import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";
import { getMapSuggestionsForUser } from '../../services/suggestMapsService.js';

export default function PlayerSelectPage() {
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleClick() {
        try {
            setLoading(true);
            const suggestions =
                await getMapSuggestionsForUser(playerId);
            setLoading(false);
            if (suggestions) {
                navigate(`/suggestions/${playerId}`, { state: { suggestions } });
            } else {
                console.error("No suggestions found.");
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
    }

    return (
        <div className="h-screen w-screen relative text-white bg-less-dark flex flex-col justify-center items-center overflow-hidden">
            <div className="flex flex-col items-center p-16 py-32 bg-dark rounded-lg">
                <Header />
                <div className="flex flex-row">
                    <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} disabled={loading} />
                    <LoaderButton text="Get Suggestions" onClick={handleClick} disabled={loading} />
                </div>
                <div className={`flex flex-row mt-10`}>
                    {loading && <Spinner />}
                    {error && <div className="text-red-500 mt-4">Error: {error.message}</div>}
                </div>
            </div>
        </div>
    );
}