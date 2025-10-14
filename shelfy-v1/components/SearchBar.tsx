'use client';

import { Search } from 'lucide-react';
import React, {useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from "next/navigation";


const SearchBar = () => {

    // Get initial query from URL
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('query') ?? '';

    // useState to keep track of current search input: Initially empty string or from URL
    const [query, setQuery] = useState(initialQuery);

    // useState to keep track of generated suggestions: array of strings
    const [suggestions, setSuggestions] = useState<string[]>([]);

    // useState to display generated suggestions or not: Initially false
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Reset state variable for suggestion display: Initially false
    const [isManualSelect, setIsManualSelect] = useState(false)

    // useState to keep track of highlighted search suggestion in popup
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    // Router and path hooks from Next.js to handle navigation and path changes
    const router = useRouter();
    const pathName = usePathname();

    // Ref for the input element to manage focus and blur
    const inputRef = useRef<HTMLInputElement | null>(null);

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
                // Fetch from Datamuse API using their /sug endpoint and pass the query state variable
                const response = await fetch(
                    // We use controller.signal as a signal option in our fetch
                    `https://api.datamuse.com/sug?s=${query}`, { signal: controller.signal }
                );

                // Receive data
                const data = await response.json();

                // Extract "word"-attribute from data and save it in our suggestions state variable
                setSuggestions(data.map(( item: { word: string } ) => item.word));

                // show suggestions
                setShowSuggestions(true);

                // set highlighted suggestion to "none"
                setHighlightedIndex(-1);
            // If fetch failed (not ok), log error to console
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error('Fetch Error: ', err)
                }
            }
        };
        // Delay (debounce) fetchSuggestions by 100ms
        const debounceTimer = setTimeout(fetchSuggestions, 100);

        // Cleanup function to clear timeout and abort fetch on component unmount or before next effect run
        return () => {
            clearTimeout(debounceTimer);
            controller.abort();
        };
    }, [query]);// Effect runs whenever query state variable changes


    // On change of input field, update query state variable
    const handleChange = (e: any) => {
        setQuery(e.target.value)
    }

    // When a suggestion is selected, update query state variable, hide suggestions, and reset highlighted index
    const handleSelect = (value: string) => {
        setIsManualSelect(true);
        setQuery(value);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
    }

    // Close the popover whenever the URL changes
    useEffect(() => {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setSuggestions([]);

    }, [pathName, searchParams]);

    // On sumbission of the form (enter key or search button), navigate to /search with query as a search param
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // stop the default refresh
        if (!query.trim()) return; // do nothing if empty

        // proactively close and blur before navigating
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();

        // Navigate to a new URL with query param and a default sort
        router.push(`/search?query=${encodeURIComponent(query)}&sort=name%2Casc`);
    };

    // Ref for the wrapper div to detect clicks outside of it
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    // Effect to handle clicks outside the component to close suggestions
    useEffect(() => {
        // Function to handle pointer down events on the document
        // If the click is outside the wrapperRef element, hide suggestions
        const onDocPointerDown = (e: PointerEvent) => {
            const el = wrapperRef.current as HTMLElement;
            if (!el) return;
            if (el.contains(e.target as Node)) return;
            setShowSuggestions(false);
            setHighlightedIndex(-1);
        }
        // Add event listener on mount and clean up on unmount
        document.addEventListener('pointerdown', onDocPointerDown, true);
        return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
    }, [])

    return (
        <div className="relative flex justify-center gap-3">
            <form onSubmit={handleSubmit} className="relative w-[800px]" >
                {/* Wrap input and suggestions in a div with ref to detect outside clicks */}
                <div ref={wrapperRef}>
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <div className="relative">
                        <input
                            name="search"
                            placeholder="Search for an item..."
                            value={query}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                // Handle keyboard navigation for suggestions
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

                        {/* Suggestion dropdown, conditionally rendered based on showSuggestions state */}
                        {showSuggestions && (
                            <div className="absolute left-0 right-0 bg-white border rounded-md mt-1 shadow-md z-50">
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
                </div>
            </form>
        </div>
    );
};

export default SearchBar;