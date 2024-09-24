const UserService = require("../services/user_service");
const { UserRepository } = require("../database");
const { UserModel } = require("../database/models");
const {
    FormatData,
    GeneratePassword,
    GenerateSalt,
    GenerateSignature,
    ValidatePassword
} = require('../utils');
const { APIError, BadRequestError, STATUS_CODES } = require('../utils/app-errors');

// Mock the dependencies
jest.mock('../database');
jest.mock('../database/models/User');
jest.mock('../utils');
jest.mock('../utils/app-errors');

describe('UserService', () => {
    let userService;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            CreateUser: jest.fn(),
            FindUser: jest.fn(),
            FindUserById: jest.fn(),
        };
        UserRepository.mockImplementation(() => mockRepository);
        userService = new UserService();

        // Mock FormatData to return its input
        FormatData.mockImplementation(data => data);

        // Mock APIError constructor
        APIError.mockImplementation((message, statusCode, description) => ({
            message,
            statusCode,
            description,
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('SignUp', () => {
        const userInputs = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully sign up a new user', async () => {
            const salt = 'generatedSalt';
            const hashedPassword = 'hashedPassword';
            const newUser = {
                ...userInputs,
                _id: 'userId',
                password: hashedPassword,
                salt,
                balance: 0,
            };
            const token = 'generatedToken';

            GenerateSalt.mockResolvedValue(salt);
            GeneratePassword.mockResolvedValue(hashedPassword);
            mockRepository.FindUser.mockResolvedValue(null);
            mockRepository.CreateUser.mockResolvedValue(newUser);
            GenerateSignature.mockResolvedValue(token);
            FormatData.mockImplementation(data => data);

            const result = await userService.SignUp(userInputs);

            expect(GenerateSalt).toHaveBeenCalled();
            expect(GeneratePassword).toHaveBeenCalledWith(userInputs.password, salt);
            expect(mockRepository.FindUser).toHaveBeenCalledWith({
                $or: [{ username: userInputs.username }, { email: userInputs.email }]
            });
            expect(mockRepository.CreateUser).toHaveBeenCalledWith({
                username: userInputs.username,
                email: userInputs.email,
                password: hashedPassword,
                salt
            });
            expect(GenerateSignature).toHaveBeenCalledWith({ email: userInputs.email, _id: newUser._id });
            expect(result).toEqual(newUser);
        });

        it('should return an error if user already exists', async () => {
            mockRepository.FindUser.mockResolvedValue({ username: userInputs.username });
            FormatData.mockImplementation(data => data);

            const result = await userService.SignUp(userInputs);

            expect(mockRepository.FindUser).toHaveBeenCalled();
            expect(result).toEqual({
                message: 'User already exists',
                statusCode: 400,
            });
            expect(mockRepository.CreateUser).not.toHaveBeenCalled();
        });

    });

    describe('SignIn', () => {
        const userInputs = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully sign in an existing user', async () => {
            const existingUser = {
                _id: 'userId',
                email: userInputs.email,
                password: 'hashedPassword',
                salt: 'userSalt',
            };
            const token = 'generatedToken';

            mockRepository.FindUser.mockResolvedValue(existingUser);
            ValidatePassword.mockResolvedValue(true);
            GenerateSignature.mockResolvedValue(token);
            FormatData.mockImplementation(data => data);

            const result = await userService.SignIn(userInputs);

            expect(mockRepository.FindUser).toHaveBeenCalledWith({ email: userInputs.email });
            expect(ValidatePassword).toHaveBeenCalledWith(userInputs.password, existingUser.password, existingUser.salt);
            expect(GenerateSignature).toHaveBeenCalledWith({ email: existingUser.email, _id: existingUser._id });
            expect(result).toEqual({ id: existingUser._id, token });
        });

        it('should return null for invalid credentials', async () => {
            const existingUser = {
                _id: 'userId',
                email: userInputs.email,
                password: 'hashedPassword',
                salt: 'userSalt',
            };

            mockRepository.FindUser.mockResolvedValue(existingUser);
            ValidatePassword.mockResolvedValue(false);
            FormatData.mockImplementation(data => data);

            const result = await userService.SignIn(userInputs);

            expect(mockRepository.FindUser).toHaveBeenCalledWith({ email: userInputs.email });
            expect(ValidatePassword).toHaveBeenCalledWith(userInputs.password, existingUser.password, existingUser.salt);
            expect(result).toBeNull();
        });

        it('should return null for non-existent user', async () => {
            mockRepository.FindUser.mockResolvedValue(null);
            FormatData.mockImplementation(data => data);

            const result = await userService.SignIn(userInputs);

            expect(mockRepository.FindUser).toHaveBeenCalledWith({ email: userInputs.email });
            expect(result).toBeNull();
        });
    });
});