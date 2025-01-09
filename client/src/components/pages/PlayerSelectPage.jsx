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
    const [errorMessage, setErrorMessage] = useState(null);

    async function handleClick() {
        try {
            setLoading(true);
            const suggestions =
                await getMapSuggestionsForUser(playerId);
            setLoading(false);
            if (suggestions) {
                navigate(`/bs-map-suggester/suggestions`, { state: { suggestions } });
            } else {
                console.error("No suggestions found.");
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
    }
    console.log(playerId);
    return (
        <div className="checkerboard h-screen w-screen relative text-white bg-dark flex flex-col justify-center items-center overflow-hidden">
            <div className={`flex flex-col items-center`}>
                <Header />
                <div className="flex flex-row">
                    <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} onChange={() => setPlayerId(null)} disabled={loading} />
                    <LoaderButton text="Get Suggestions" onClick={handleClick} disabled={loading || !playerId} />
                </div>
                <div className={"flex flex-row mt-10"}>
                    {loading && <Spinner />}
                    {errorMessage && <div className="text-red-500 mt-4">Error: {errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}