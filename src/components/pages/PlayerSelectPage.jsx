import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";
import { getMapSuggestionsForUser } from '../../services/suggestMapsService.js';
import '../../index.css';

export default function PlayerSelectPage() {
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [expand, setExpand] = useState(false);
    const [error, setError] = useState(null);

    async function handleClick() {
        try {
            setLoading(true);
            const suggestions =
                await getMapSuggestionsForUser(playerId);
            setLoading(false);
            if (suggestions) {
                setExpand(true);
                setTimeout(() => {
                    navigate(`/suggestions/${playerId}`, { state: { suggestions } });
                }, 400);
            } else {
                console.error("No suggestions found.");
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
    }

    return (
        <div className="checkerboard h-screen w-screen relative text-white bg-black flex flex-col justify-center items-center overflow-hidden">
            <div className={`flex flex-col items-center justify-center px-16 py-32 bg-dark rounded-3xl shadow-lg transition-all duration-300 ${expand ? 'w-screen h-screen' : 'w-[60rem] h-[25rem]'}`}>
                <div className={`flex flex-col items-center transition-opacity duration-300 ${expand ? 'opacity-0' : 'opacity-100'}`}>
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
        </div>
    );
}