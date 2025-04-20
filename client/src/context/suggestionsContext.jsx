import { createContext, useContext, useState, useEffect } from 'react';

const SuggestionsContext = createContext();

export function SuggestionsProvider({ children }) {
    const [suggestions, setSuggestions] = useState(() => {
        const savedSuggestions = localStorage.getItem('suggestions');
        return savedSuggestions ? JSON.parse(savedSuggestions) : [];
    });

    useEffect(() => {
        localStorage.setItem('suggestions', JSON.stringify(suggestions));
    }, [suggestions]);

    return (
        <SuggestionsContext.Provider value={{ suggestions, setSuggestions }}>
            {children}
        </SuggestionsContext.Provider>
    );
}

export function useSuggestions() {
    return useContext(SuggestionsContext);
}