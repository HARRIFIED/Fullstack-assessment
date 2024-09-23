import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery, searchCharacters } from '../../redux/slices/searchSlice';
import { addSearchTerm } from '../../redux/slices/searchHistorySlice';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.scss';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const query = useSelector((state) => state.search.query);
    const searchHistory = useSelector((state) => state.searchHistory.history);
    const [localQuery, setLocalQuery] = useState(query);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (localQuery.trim() !== '') {
                dispatch(setQuery(localQuery));
                dispatch(searchCharacters(localQuery));
                dispatch(addSearchTerm(localQuery));
            }
        }, 500); // Debounce to prevent excessive API calls

        return () => clearTimeout(delayDebounceFn);
    }, [localQuery, dispatch]);

    useEffect(() => {
        if (localQuery.trim() === '') {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = searchHistory.filter((term) =>
            term.toLowerCase().includes(localQuery.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
    }, [localQuery, searchHistory]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSuggestionClick = (term) => {
        setLocalQuery(term);
        setShowSuggestions(false);
        navigate('/search');
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => navigate('/')} >
                <h1>Star Wars Explorer</h1>
            </div>
            <div className="search-bar" ref={suggestionsRef}>
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search characters..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onClick={() => navigate('/search')} // Navigate to /search on click
                    onFocus={() => {
                        if (filteredSuggestions.length > 0) {
                            setShowSuggestions(true);
                        }
                    }}
                />
                {showSuggestions && (
                    <ul className="autocomplete-dropdown">
                        {filteredSuggestions.map((term, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(term)}
                                className="autocomplete-item"
                            >
                                {term}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </header>
    );
};

export default Header;
