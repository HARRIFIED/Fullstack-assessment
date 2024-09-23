const dotEnv = require("dotenv");
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
module.exports = async () => {
    try {
        const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        const connect = await mongoose.connect(uri);
        console.log(`Database Connected: ${connect.connection.host}:${connect.connection.port}`);
    } catch (error) {
        console.log(error);
    }
}