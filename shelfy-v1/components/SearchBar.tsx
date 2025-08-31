'use client';

import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const SearchBar = () => {
    // Keep track of current input
    const [query, setQuery] = useState('');

    // Generate suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Display generated suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Reset state variable for suggestion display
    const [isManualSelect, setIsManualSelect] = useState(false)

    useEffect(() => {

        // If suggestion has been manually selected, set state to false and do not generate any suggestions (return)
        if (isManualSelect) {
            setIsManualSelect(false);
            return;
        }

        // Cancel a fetch request with AbortController
        const controller = new AbortController();

        const fetchSuggestions = async () => {
            // Do not fetch and do not display any suggestions if length of query is less than 2.
            if (query.trim().length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                // fetch from Datamuse API using their /sug endpoint and pass the query state variable
                const response = await fetch(
                    `https://api.datamuse.com/sug?s=${query}`, { signal: controller.signal } // We use controller.signal as a signla option in our fetch
                );

                // Receive data
                const data = await response.json();

                // Extract "word"-attribute from data and save it in our suggestions state variable
                setSuggestions(data.map(( item: { word: string } ) => item.word));

                // show suggestions
                setShowSuggestions(true);

            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Fetch Error: ', err)
                }
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);

        return () => {
            clearTimeout(debounceTimer);
            controller.abort();
        };

    }, [query]);


    const handleChange = (e: any) => {
        setQuery(e.target.value)
    }

    const handleSelect = (value: string) => {
        setIsManualSelect(true);
        setQuery(value);
        setShowSuggestions(false);
    }

    return (
        <div className="relative flex justify-center gap-3">
            <form className="relative w-200">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                />

                <input
                    name="search"
                    placeholder="Search for an item..."
                    value={query}
                    className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    onChange={handleChange}
                />

                {showSuggestions && (
                    <ul className="absolute left-0 right-0 bg-white border rounded-md mt-1 shadow-md max-h-40 overflow-y-auto z-10">
                        {suggestions.length > 0 ? (
                            suggestions.map((suggestion, i) => (
                                <li
                                    key={i}
                                    onClick={() => handleSelect(suggestion)}
                                    className="px-3 py-2 hover:bg-amber-100 cursor-pointer"
                                >
                                    {suggestion}
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-gray-500">
                                No results found.
                            </li>
                        )}
                    </ul>
                )}
            </form>
        </div>
    );
};

export default SearchBar;