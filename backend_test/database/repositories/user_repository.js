const { UserModel } = require("../models");
const {
    APIError,
    BadRequestError,
    STATUS_CODES,
} = require("../../utils/app-errors");

//Dealing with database operations
class UserRepository extends BadRequestError {
    async CreateUser({
         username,
         email,
         password,
         salt
    }) {
        try {
            const newUser = new UserModel({
                username,
                email,
                password,
                balance: 0,
                salt
            });
            return  await newUser.save();
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create User"
            );
        }
    }
    async FindUser(params) {
        try {
            return await UserModel.findOne(params);
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find user by given parameter"
            );
        }
    }

    async FindUserById(id) {
        try {
            return await UserModel.findById(id)
        } catch(err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find user by Id"
            );
        }
    }
}

module.exports = UserRepository;
