import { useLocation } from 'react-router-dom';

export default function MapSuggestionsPage() {
    const location = useLocation();
    const { suggestions = [] } = location.state || {};

    return (
        <div className="relative text-white flex flex-col justify-center items-center">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl">Map Suggestions</h2>
                    <ul>
                        {suggestions.map((map, index) => (
                            <li key={map.id}>
                                <span>{index + 1}. </span>
                                <span>{map.songName}</span>
                                <span> {map.id} </span>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-2xl">No suggestions available</h2>
                </div>
            )}
        </div>
    );
}