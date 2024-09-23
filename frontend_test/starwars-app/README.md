# Star Wars Explorer

A web application built with **React** and **Vite** that allows users to search and explore information about Star Wars characters using the Star Wars API. The application supports saving favorite characters and includes a bonus feature for persistent search history with autocomplete suggestions.

## Features

- **Character Search**: Search for your favorite Star Wars characters using the Star Wars API.
- **Character Details**: View detailed information about a character, including name, height, mass, and films they appeared in.
- **Favorites**: Add and remove characters from your list of favorites, which persists across sessions.
- **Search History**: The application saves your past search terms and provides autocomplete suggestions as you type.
- **Responsive Design**: Fully responsive and optimized for both desktop and mobile devices.

### Bonus Feature: Persistent Search History with Autocomplete

- **Search Autocomplete**: As you type in the search bar, previously searched terms will appear as suggestions in a dropdown.
- **History Persistence**: Search history is persisted across sessions using Redux Persist, ensuring that users can revisit past searches even after refreshing the page.
- **Selectable Suggestions**: Users can click on any autocomplete suggestion to quickly search for that character again.


### Key Files

- **`src/redux/slices/searchSlice.js`**: Manages the search state and API calls for characters.
- **`src/redux/slices/favoritesSlice.js`**: Handles the addition and removal of favorite characters.
- **`src/redux/slices/searchHistorySlice.js`**: Manages the search history and autocomplete functionality.
- **`src/components/Header/Header.jsx`**: Contains the search bar and autocomplete dropdown logic.
- **`src/pages/HomePage.jsx`**: The main page where users can search and view characters.
- **`src/pages/CharacterDetailsPage.jsx`**: Displays detailed information about a selected character.
- **`src/pages/SearchResultsPage.jsx`**: Shows the results of the user's search query.

## Installation and Setup

Follow the steps below to get the project up and running on your local machine.

### Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/star-wars-explorer.git
   cd frontend_test/starwars-explorer

2. **Install dependency**:

    ```bash
       yarn install
       npm install
   
3. **Run Application**:

     ```bash
       yarn dev
       npm run dev

**The application will start at http://localhost:5173 (default Vite port).**

***Happy Hacking 😎😎***
