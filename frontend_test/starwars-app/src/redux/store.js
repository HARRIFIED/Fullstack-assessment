import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './slices/charactersSlice';
import favoritesReducer from './slices/favoritesSlice';
import searchReducer from './slices/searchSlice';
import searchHistoryReducer from './slices/searchHistorySlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const favoritesPersistConfig = {
    key: 'favorites',
    storage,
};

const searchHistoryPersistConfig = {
    key: 'searchHistory',
    storage,
};

const persistedFavoritesReducer = persistReducer(favoritesPersistConfig, favoritesReducer);
const persistedSearchHistoryReducer = persistReducer(searchHistoryPersistConfig, searchHistoryReducer);

export const store = configureStore({
    reducer: {
        characters: charactersReducer,
        favorites: persistedFavoritesReducer,
        search: searchReducer,
        searchHistory: persistedSearchHistoryReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore redux-persist actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);
