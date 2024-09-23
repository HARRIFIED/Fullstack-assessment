const { UserRepository } = require("../database");
const {
    FormatData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword
} = require('../utils');
const { APIError, STATUS_CODES } = require('../utils/app-errors');

class UserService {
    constructor() {
        this.repository = new UserRepository();
    }

    async SignUp(userInputs){
        const {
            username,
            email,
            password,
        } = userInputs;

        try{
            // create salt
            let salt = await GenerateSalt();

            let userPassword = await GeneratePassword(password, salt);

            const existingUser = await this.repository.FindUser({ $or: [{ username }, { email }] })
            if (existingUser) {
                return FormatData({
                    message: 'User already exists',
                    statusCode: 400,
                })
            }

            const newUser = await this.repository.CreateUser({
                username,
                email,
                password: userPassword,
                salt
            });

            const token = await GenerateSignature({ email: email, _id: newUser._id});

            return FormatData(newUser);

        }catch(err){
            throw new APIError('Data Not found', err)
        }

    }


    async SignIn(userInputs){

        const { email, password } = userInputs;
        try {
            const existingUser = await this.repository.FindUser({ email});
            if(existingUser){

                const validPassword = await ValidatePassword(password, existingUser.password, existingUser.salt);

                if(validPassword){
                    const token = await GenerateSignature({
                        email: existingUser.email,
                        _id: existingUser._id
                    });
                    return FormatData({id: existingUser._id, token });
                }
            }

            return FormatData(null);

        } catch (err) {
            throw new APIError('Data Not found', err)
        }

    }

}

module.exports = UserService;