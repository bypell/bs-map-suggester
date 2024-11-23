import { useState, useEffect } from 'react';

import { getPlayers } from '../api/players';

function PlayerIdInput({ onValidPlayerEntered, disabled }) {
    const [inputValue, setInputValue] = useState('');
    const [playerSearchResults, setPlayerSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    function handleChange(event) {
        const value = event.target.value;
        setInputValue(value);
    };

    function handleBlur(event) {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsFocused(false);
        }
    };

    async function handleDebounced(value) {
        setPlayerSearchResults([]);
        if (value.length < 3) {
            setPlayerSearchResults([]);
            return;
        }

        try {
            const players = await getPlayers(value);
            setPlayerSearchResults(players.slice(0, 5));
            onValidPlayerEntered(value);
        } catch (error) {
            console.error('Error fetching players:', error);
        }

    }

    function handleSelectedSuggestedPlayer(event) {
        const playerName = event.target.textContent;
        setInputValue(playerName);
        setIsFocused(false);

    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleDebounced(inputValue);
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    return (<>
        <div className="relative flex mx-4" onFocus={() => setIsFocused(true)} onBlur={handleBlur}>
            {/*player suggestions */}
            <div className={`absolute pt-14 w-full text-lg text-dark bg-less-dark rounded-xl transition-all duration-200 ease-in-out overflow-hidden ${playerSearchResults.length === 0 || !isFocused ? 'max-h-0 bg-opacity-0 shadow-none' : 'max-h-96 bg-opacity-100 shadow-md'}`}
                style={{ height: `${(playerSearchResults.length + 2) * 32}px` }}
            >
                {playerSearchResults.map(player => (
                    <button key={player.id} className="flex flex-row relative w-full h-8 justify-between items-center px-4 text-white hover:cursor-pointer hover:bg-even-less-dark hover:shadow-lg hover:duration-200 active:bg-even-even-less-dark active:duration-100
            active:ring-2 active:ring-main"
                        onClick={handleSelectedSuggestedPlayer}
                    >
                        <p>{player.name}</p>
                        <img src={player.profilePicture} alt="" className="w-6 h-6 rounded-full absolute right-1" />
                    </button>
                ))}
            </div>

            {/*text bar*/}
            <input
                type="text"
                id="playerIdInput"
                value={inputValue}
                onChange={handleChange}
                disabled={disabled}
                className={`
                h-12
              px-4 py-2 text-lg z-10
              text-dark bg-white rounded-xl shadow-md outline-none
              transition-all duration-200
              focus:ring-2 focus:ring-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:duration-100'}
              `}
                placeholder="your username"
            />
        </div>
    </>);
}

export default PlayerIdInput