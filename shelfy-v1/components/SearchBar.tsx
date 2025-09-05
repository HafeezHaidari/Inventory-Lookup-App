'use client';

import { Search } from 'lucide-react';
import React, {useState, useEffect, useRef} from 'react';

const SearchBar = () => {
    // Keep track of current input
    const [query, setQuery] = useState('');

    // Generate suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // Display generated suggestions
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Reset state variable for suggestion display
    const [isManualSelect, setIsManualSelect] = useState(false)

    // Keep track of highlighted search suggestion in popup
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

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
                setHighlightedIndex(-1);
                return;
            }

            try {
                // fetch from Datamuse API using their /sug endpoint and pass the query state variable
                const response = await fetch(
                    `https://api.datamuse.com/sug?s=${query}`, { signal: controller.signal } // We use controller.signal as a signal option in our fetch
                );

                // Receive data
                const data = await response.json();

                // Extract "word"-attribute from data and save it in our suggestions state variable
                setSuggestions(data.map(( item: { word: string } ) => item.word));

                // show suggestions
                setShowSuggestions(true);

                // set highlighted suggestion to "none"
                setHighlightedIndex(-1);

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
        setHighlightedIndex(-1);
    }

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocPointerDown = (e: PointerEvent) => {
            const el = wrapperRef.current as HTMLElement;
            if (!el) return;
            if (el.contains(e.target as Node)) return;
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
        document.addEventListener('pointerdown', onDocPointerDown, true);
        return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [])

    return (
        <div className="relative flex justify-center gap-3">
            <form className="relative w-[800px]" >
                <div ref={wrapperRef}>
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
                        onKeyDown={(e) => {
                            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && suggestions.length > 0) {
                                e.preventDefault();
                                if (!showSuggestions) {
                                    setShowSuggestions(true);
                                    setHighlightedIndex(e.key === 'ArrowDown' ? 0 : suggestions.length - 1);
                                    return;
                                }
                                setHighlightedIndex(prev => {
                                    if (e.key === 'ArrowDown') {
                                        return prev === -1 ? 0 : (Math.min(prev + 1, suggestions.length - 1));
                                    } else {
                                        if (prev > 0) return prev- 1;
                                        if (prev === 0) return -1

                                        return suggestions.length - 1;
                                    }
                                });
                            } else if (e.key === 'Enter' && showSuggestions && highlightedIndex >= 0 && suggestions.length > 0) {
                                e.preventDefault();
                                handleSelect(suggestions[highlightedIndex]);
                            } else if (e.key === 'Tab' && showSuggestions && highlightedIndex >= 0 && suggestions.length > 0) {
                                e.preventDefault();
                                handleSelect(suggestions[highlightedIndex]);
                            } else if (e.key === 'Escape' && showSuggestions) {
                                e.preventDefault();
                                setShowSuggestions(false);
                                setHighlightedIndex(-1);
                            } else if (showSuggestions && (e.key === 'Home' || e.key === 'End') && suggestions.length > 0) {
                                e.preventDefault();
                                setHighlightedIndex(e.key === 'Home' ? 0 : suggestions.length - 1);
                            }
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="none"
                        spellCheck={false}
                        role="combobox"
                        aria-autocomplete="list"
                        aria-label="Search"
                        aria-haspopup="listbox"
                        aria-expanded={showSuggestions}
                        aria-controls="suggestions"
                        aria-activedescendant={highlightedIndex >= 0 ? "suggestion-" + highlightedIndex : undefined}
                    />

                    {showSuggestions && (
                        <div className="absolute left-0 right-0 bg-white border rounded-md mt-1 shadow-md z-10">
                            <ul id="suggestions" role="listbox" className="max-h-40 overflow-y-auto">
                                {suggestions.map((suggestion, i) => (
                                    <li
                                        key={i}
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(suggestion)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSelect(suggestion)
                                            }}
                                        }
                                        className={`px-3 py-2 cursor-pointer ${
                                            highlightedIndex === i ? "bg-green-200" : "hover:bg-green-100"
                                        }`}
                                        id={"suggestion-" + i}
                                        role="option"
                                        aria-selected={highlightedIndex === i}
                                    >
                                        {suggestion}
                                    </li>
                                    ))}
                            </ul>
                            {suggestions.length === 0 && (
                                <div role="status" aria-live="polite" className="px-3 py-2 text-gray-500">No results found.</div>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SearchBar;