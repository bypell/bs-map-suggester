import { useLocation } from 'react-router-dom';
import { getDifficultyStyle } from '../../utils/helpers';

export default function MapSuggestionsPage() {
    const location = useLocation();
    const { suggestions = [] } = location.state || {};

    return (
        <div className="relative text-white flex flex-col justify-center items-center">
            {suggestions.length > 0 ? (
                <div className="mt-4">
                    <h2 className="text-2xl mb-5 ml-2">Map Suggestions</h2>
                    {suggestions.map((suggestion, index) => (
                        <div className='bg-less-dark pr-2 mb-2 shadow-md min-w-80' key={index}>
                            <div className='flex flex-row items-center'>
                                <img src={suggestion.leaderboard.coverImage} alt="song cover image" className="w-20 h-20" />
                                <div className='flex flex-col ml-4'>
                                    <h3 className="text-xl">{suggestion.leaderboard.songName}</h3>
                                    <p>{suggestion.leaderboard.songAuthorName}</p>
                                </div>
                                <div className='flex flex-row ml-auto items-center'>
                                    <i className={`fas fa-star text-difficulty-${getDifficultyStyle(suggestion.leaderboard.difficulty.difficulty)}`}></i>
                                    <p>{suggestion.leaderboard.stars}</p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            ) : (
                <div className="mt-4">
                    <h2 className="text-2xl">No suggestions available</h2>
                </div>
            )}
        </div>
    );
}