import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../../redux/slices/favoritesSlice';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './Sidebar.scss';

const Sidebar = () => {
    const favorites = useSelector((state) => state.favorites.items);
    const dispatch = useDispatch();

    const handleRemove = (url) => {
        dispatch(removeFavorite(url));
    };

    return (
        <aside className="sidebar">
            <h2>Favorites</h2>
            {favorites.length === 0 ? (
                <p>No favorites added.</p>
            ) : (
                <ul>
                    {favorites.map((character) => {
                        // Extract character ID from URL
                        const id = character.url.match(/\/people\/(\d+)\//)[1];
                        return (
                            <li key={character.url}>
                                <Link to={`/character/${id}`}>{character.name}</Link>
                                <button onClick={() => handleRemove(character.url)} className="remove-btn">
                                    <FaTrash />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </aside>
    );
};

export default Sidebar;
