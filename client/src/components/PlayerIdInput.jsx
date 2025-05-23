import { useState } from 'react';
import usePlayerSearch from '../hooks/usePlayerSearch';
import Spinner from './common/Spinner';
import { truncateString } from '../utils/helpers';

function PlayerIdInput({ onValidPlayerEntered, onChange, disabled, errorCallback }) {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const { playerSearchResults, isLoading } = usePlayerSearch(inputValue, (error) => {
        setInputValue('');
        setIsFocused(false);
        if (errorCallback) errorCallback(error);
    });


    function handleChange(event) {
        if (!isFocused) return;
        const value = event.target.value;
        setInputValue(value);
        if (onChange) onChange(value);
    };

    function handleBlur(event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsFocused(false);
        }
    };

    function handleSelectedSuggestedPlayer(player) {
        const playerName = player.name;
        setInputValue(playerName);
        setIsFocused(false);
        onValidPlayerEntered(player.id);
    }

    return (<>
        <div className="relative flex md:mx-4 z-10 w-full" onFocus={() => setIsFocused(true)} onBlur={handleBlur}>
            {/*player suggestions */}
            <div className={`overflow-y-auto overflow-x-hidden max-h-[calc(40vh-10px)] absolute pt-14 px-1 pb-2 w-full text-lg text-dark bg-less-dark rounded-xl transition-all duration-200 ease-in-out ${!playerSearchResults || playerSearchResults.length === 0 || !isFocused ? 'max-h-0 bg-opacity-0 shadow-none hidden' : 'bg-opacity-100 shadow-md'}`}
            >
                {playerSearchResults && playerSearchResults.map(player => (
                    <button key={player.id} className="relative flex flex-row w-full h-8 justify-between items-center px-4 text-white hover:cursor-pointer hover:bg-even-less-dark hover:shadow-lg hover:duration-200 active:z-10 active:bg-even-even-less-dark active:duration-100 active:ring-2 active:ring-main outline-none"
                        onClick={() => handleSelectedSuggestedPlayer(player)}
                        title={`${player.name} (#${player.rank})`}
                    >
                        <span className={`fi fi-${player.country.toLowerCase()} w-6 h-6 relative left-1 rounded-full`} />
                        <p className="flex-grow text-center text-nowrap">{truncateString(player.name, 30)}</p>
                        <img src={player.profilePicture} alt="avatar" className="w-6 h-6 relative right-1 rounded-full" />
                    </button>
                ))}
            </div>

            {/* Input field with spinner */}
            <div className="relative w-full z-20">
                <input
                    type="text"
                    id="playerIdInput"
                    value={inputValue}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    disabled={disabled}
                    autoComplete="off"
                    className={`h-12 w-full px-5 py-2 text-lg z-10 focus:placeholder-transparent text-center text-dark bg-white rounded-xl shadow-md outline-none transition-all duration-200 focus:ring-2 focus:ring-main hover:shadow-lg hover:duration-100 ${disabled && 'opacity-50 cursor-default'}`}
                    placeholder="Enter your scoresaber username"
                />
                {isLoading && isFocused && (
                    <div className="absolute inset-y-0 right-0 mr-1 flex items-center pr-4 pointer-events-none">
                        <Spinner size={6} thickness={3} />
                    </div>
                )}
            </div>
        </div>
    </>);
}

export default PlayerIdInput