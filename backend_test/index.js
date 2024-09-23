require('dotenv').config();
const { databaseConnection } = require('./database');
const express = require('express');
const expressApp = require('./expressApp');

const app = express();

async function initializeApp() {
    try {
        await databaseConnection();
        await expressApp(app);
        return app
    } catch (error) {
        console.error('Failed to initialize the app:', error);
        throw error;
    }
}

// For local development
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    initializeApp().then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch(error => {
        console.error('Failed to start the server:', error);
        process.exit(1);
    });
}

module.exports = app;