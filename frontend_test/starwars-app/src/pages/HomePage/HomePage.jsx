import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCharacters } from '../../redux/slices/charactersSlice.js';
import CharacterCard from '../../components/CharacterCard/CharacterCard';
import './HomePage.scss';

const HomePage = () => {
    const dispatch = useDispatch();
    const { data, status, error, next, previous } = useSelector((state) => state.characters);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchCharacters(page));
    }, [dispatch, page]);

    const handleNext = () => {
        if (next) setPage(page + 1);
    };

    const handlePrevious = () => {
        if (previous) setPage(page - 1);
    };

    return (
        <div className="home-page">
            <h2>Characters</h2>
            {status === 'loading' && <p>Loading characters...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && (
                <>
                    <div className="character-list">
                        {data.map((character) => (
                            <CharacterCard key={character.url} character={character} />
                        ))}
                    </div>
                    <div className="pagination">
                        <button onClick={handlePrevious} disabled={!previous}>
                            Previous
                        </button>
                        <span>Page {page}</span>
                        <button onClick={handleNext} disabled={!next}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;
