const express = require('express');
const cors  = require('cors');
const {user, transaction} = require('./api')
const HandleErrors = require('./utils/error-handler')


module.exports = async (app) => {

    app.use(express.json({ limit: '1mb'}));
    app.use(express.urlencoded({ extended: true, limit: '1mb'}));
    app.use(cors());

    app.get('/health', (req, res) => {
        res.json({ message: "Server running perfectly" }).status(200)
    })
    //
    // //api
    user(app)
    transaction(app)

    // error handling
    app.use(HandleErrors);
}