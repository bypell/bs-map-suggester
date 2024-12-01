import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner.jsx';
import Header from "../Header.jsx";
import LoaderButton from "../LoaderButton.jsx";
import PlayerIdInput from "../PlayerIdInput.jsx";
import { useMapSuggestions } from '../../hooks/useMapSuggestions';

export default function PlayerSelectPage() {
    const { loading, suggestions, error, fetchMapSuggestions } = useMapSuggestions();
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen relative bg-dark text-white flex flex-col justify-center items-center">
            {suggestions &&
                <div className="mt-4">
                    <h2 className="text-2xl">Map Suggestions</h2>
                    <ul>
                        {suggestions.map((map, index) => (
                            <li key={map.id}>
                                <span>{map.id}. </span>
                                <span>{map.songName}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
}





