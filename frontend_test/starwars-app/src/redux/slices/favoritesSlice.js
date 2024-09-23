import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [], // Array of character objects
    },
    reducers: {
        addFavorite: (state, action) => {
            const exists = state.items.find((item) => item.url === action.payload.url);
            if (!exists) {
                state.items.push(action.payload);
            }
        },
        removeFavorite: (state, action) => {
            state.items = state.items.filter((item) => item.url !== action.payload);
        },
    },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
