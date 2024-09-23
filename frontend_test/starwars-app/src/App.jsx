import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import HomePage from './pages/HomePage/HomePage.jsx';
import CharacterDetailsPage from './pages/CharacterDetails/CharacterDetails.jsx';
import SearchResultsPage from './pages/SearchResults/SearchResults.jsx';
import './App.scss';

const App = () => {
    return (
        <Router>
            <Header />
            <Sidebar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/character/:id" element={<CharacterDetailsPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                </Routes>
            </main>
        </Router>
    );
};

export default App;
