import React from 'react';
import { useSelector } from 'react-redux';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import './SearchResultsPage.scss';

const SearchResultsPage = () => {
    const { query, results, status, error } = useSelector((state) => state.search);

    return (
        <div className="search-results-page">
            <h2>Search Results for "{query}"</h2>
            {status === 'loading' && <p>Searching...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && results.length === 0 && <p>No results found.</p>}
            {status === 'succeeded' && results.length > 0 && (
                <div className="character-list">
                    {results.map((character) => {
                        // Extract character ID from URL
                        const id = character.url.match(/\/people\/(\d+)\//)[1];
                        return <CharacterCard key={character.url} character={character} />;
                    })}
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;
