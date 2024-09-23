import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCharacterDetails } from '../../api/swapi';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../redux/slices/favoritesSlice';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './CharacterDetails.scss';
import axios from 'axios';

const CharacterDetailsPage = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);
    const isFavorite = favorites.some((fav) => fav.url === `https://swapi.dev/api/people/${id}/`);

    useEffect(() => {
        const getCharacter = async () => {
            try {
                const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
                setCharacter(response.data);

                // Fetch films
                const filmPromises = response.data.films.map((filmUrl) => axios.get(filmUrl));
                const filmResponses = await Promise.all(filmPromises);
                setFilms(filmResponses.map((res) => res.data.title));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching character details:', error);
                setLoading(false);
            }
        };

        getCharacter();
    }, [id]);

    const handleFavorite = () => {
        if (isFavorite) {
            dispatch(removeFavorite(`https://swapi.dev/api/people/${id}/`));
        } else {
            dispatch(addFavorite(character));
        }
    };

    if (loading) {
        return <div className="character-details">Loading...</div>;
    }

    if (!character) {
        return <div className="character-details">Character not found.</div>;
    }

    return (
        <div className="character-details">
            <h2>
                {character.name}
                <button onClick={handleFavorite} className="favorite-btn">
                    {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
                </button>
            </h2>
            <ul>
                <li><strong>Height:</strong> {character.height} cm</li>
                <li><strong>Mass:</strong> {character.mass} kg</li>
                <li><strong>Hair Color:</strong> {character.hair_color}</li>
                <li><strong>Skin Color:</strong> {character.skin_color}</li>
                <li><strong>Eye Color:</strong> {character.eye_color}</li>
                <li><strong>Birth Year:</strong> {character.birth_year}</li>
                <li><strong>Gender:</strong> {character.gender}</li>
                <li><strong>Films:</strong>
                    <ul>
                        {films.map((film) => (
                            <li key={film}>{film}</li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default CharacterDetailsPage;
