import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCharacters = createAsyncThunk(
    'characters/fetchCharacters',
    async (page = 1) => {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        return response.data;
    }
);

const charactersSlice = createSlice({
    name: 'characters',
    initialState: {
        data: [],
        count: 0,
        next: null,
        previous: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharacters.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCharacters.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.results;
                state.count = action.payload.count;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
            })
            .addCase(fetchCharacters.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default charactersSlice.reducer;
