import React from 'react';
import { Link } from 'react-router-dom';
import './CharacterCard.scss';

const CharacterCard = ({ character }) => {
    // Extract character ID from URL
    const id = character.url.match(/\/people\/(\d+)\//)[1];

    return (
        <div className="character-card">
            <h3>{character.name}</h3>
            <p><strong>Gender:</strong> {character.gender}</p>
            <p><strong>Birth Year:</strong> {character.birth_year}</p>
            <Link to={`/character/${id}`} className="details-link">
                View Details
            </Link>
        </div>
    );
};

export default CharacterCard;
