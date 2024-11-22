import { useState } from 'react';

function PlayerIdInput({ onInputChange, disabled }) {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        const newValue = value.replace(/\D/g, '');
        setInputValue(newValue);
        onInputChange(newValue);
    };

    return (
        <>
            <label htmlFor="playerIdInput" className="font-mono">https://scoresaber.com/u/</label>
            <input
                type="text"
                id="playerIdInput"
                value={inputValue}
                onChange={handleChange}
                disabled={disabled}
                className={`
                h-12
              px-4 py-2 mx-4 text-lg text-dark bg-white rounded-xl shadow-md outline-none
              transition-all duration-200
              focus:ring-2 focus:ring-main
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:duration-100'}
              `}
                placeholder="your player id"
            />
        </>

    )
}

export default PlayerIdInput