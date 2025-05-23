import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";
import { getMapSuggestionsForUser } from '../../services/suggestMapsService.js';
import { useSuggestions } from '../../context/suggestionsContext';

export default function PlayerSelectPage() {
    const [playerId, setPlayerId] = useState('');
    const navigate = useNavigate();
    const { setSuggestions } = useSuggestions();
    const [loading, setLoading] = useState(false);
    const [loadingProgressMessage, setLoadingProgressMessage] = useState("");
    const [loadingStep, setLoadingStep] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);


    function handleProgressMessage(step, message) {
        setLoadingStep(step);
        setLoadingProgressMessage(message);
    }

    function handlePlayerSearchError(error) {
        setLoading(false);
        setErrorMessage("Failed to fetch player data. Please try again later.");
        console.error("Player search error:", error);
    }

    async function handleClick() {
        try {
            setLoading(true);
            const suggestions = await getMapSuggestionsForUser(playerId, handleProgressMessage);
            setLoading(false);
            if (suggestions) {
                setSuggestions(suggestions);
                navigate(`/bs-map-suggester/suggestions`);
            } else {
                console.error("No suggestions found.");
                setErrorMessage("No suggestions found.");
            }
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
            setLoading(false);
            setErrorMessage("Failed to fetch suggestions. Please try again later.");
        }
    }

    return (
        <div className="checkerboard h-screen w-screen text-white bg-dark flex flex-col pt-4 md:pt-0 md:justify-center items-center overflow-hidden motion-opacity-in-0 motion-duration-1500">
            <div className={'flex flex-col items-center relative'}>
                <Header />
                <div className="flex flex-col w-full md:flex-row space-y-4 md:space-y-0">
                    <PlayerIdInput onValidPlayerEntered={(id) => setPlayerId(id)} onChange={() => setPlayerId(null)} disabled={loading} errorCallback={handlePlayerSearchError} />
                    <LoaderButton text="Get Suggestions" onClick={handleClick} disabled={loading || !playerId} />
                </div>
                <div className={"flex flex-col mt-10 text-center items-center absolute top-full"}>
                    {loading && <Spinner size={12} thickness={4} />}
                    {loadingProgressMessage && <div key={loadingStep} className='pt-8 text-gray-400 font-mono font-semibold motion-preset-slide-up-md'>{loadingProgressMessage}</div>}
                    {errorMessage && <div className="text-red-500 mt-4">Error: {errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}