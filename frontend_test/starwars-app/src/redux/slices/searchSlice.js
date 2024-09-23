import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchCharacters = createAsyncThunk(
    'search/searchCharacters',
    async (query) => {
        const response = await axios.get(`https://swapi.dev/api/people/?search=${query}`);
        return response.data.results;
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        results: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        setQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearch: (state) => {
            state.query = '';
            state.results = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchCharacters.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(searchCharacters.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(searchCharacters.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
