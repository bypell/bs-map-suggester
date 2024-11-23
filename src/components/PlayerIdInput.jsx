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

    function handleDebounced(value) {
        // console.log('debounced', value);
        if (value.length < 3) {
            setPlayerSearchResults([]);
            return;
        }

        getPlayers(value).then(players => {
            setPlayerSearchResults(players.slice(0, 4));
            console.log(players.slice(0, 6));
        });

        onValidPlayerEntered(value);

    }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleDebounced(inputValue);
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]);

    return (<>
        <div className="relative flex mx-4" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
            {/*suggestion thingy*/}
            <div className={` absolute h-40 pt-14 w-full ${playerSearchResults.length === 0 || !isFocused ? 'hidden' : 'block'}
                  text-lg text-dark bg-less-dark rounded-xl shadow-md
                  transition-all duration-200
                  focus:ring-2 focus:ring-main`}
                style={{ height: `${(playerSearchResults.length + 2) * 32}px` }}
            >
                {/* underline text when hover */}
                {playerSearchResults.map(player => (
                    <button key={player.id} className="flex flex-row w-full justify-between items-center px-4 mt-1 text-white hover:cursor-pointer bg-less-dark hover:bg-even-less-dark hover:shadow-lg hover:duration-200 active:bg-even-even-less-dark active:duration-100
            active:ring-2 active:ring-main">
                        <p>{player.name}</p>
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