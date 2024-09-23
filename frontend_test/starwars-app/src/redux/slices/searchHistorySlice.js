import { createSlice } from '@reduxjs/toolkit';

const searchHistorySlice = createSlice({
    name: 'searchHistory',
    initialState: {
        history: [],
    },
    reducers: {
        addSearchTerm: (state, action) => {
            const term = action.payload.trim();
            if (term === '') return;

            // Prevent duplicates by removing the term if it already exists
            state.history = state.history.filter((item) => item.toLowerCase() !== term.toLowerCase());

            state.history.unshift(term);

            //Limited the history to the last 10 searches
            if (state.history.length > 10) {
                state.history.pop();
            }
        },
        clearSearchHistory: (state) => {
            state.history = [];
        },
    },
});

export const { addSearchTerm, clearSearchHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
