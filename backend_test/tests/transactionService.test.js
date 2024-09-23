const TransactionService = require('../services/transaction_service');
const { TransactionRepository, UserRepository } = require("../database");
const FlutterwaveService = require('../services/flutterwave_service');
const { FormatData } = require('../utils');

// Mock dependencies
jest.mock('../database/models/Transaction');
jest.mock('../database/models/User');
jest.mock('../services/flutterwave_service');
jest.mock('../utils');

describe('TransactionService', () => {
    let transactionService;
    let mockTransactionRepository;
    let mockUserRepository;
    let mockFlutterwaveService;

    beforeEach(() => {
        //  So Instead of instantiating the real repositories, I created mock objects
        mockTransactionRepository = {
            UpdateUserBalance: jest.fn(),
            CreateRecord: jest.fn(),
        };
        mockUserRepository = {
            FindUserById: jest.fn(),
        };
        mockFlutterwaveService = {
            MockFlutterwavePayment: jest.fn(),
        };

        // Instantiate the service and inject the mock repositories
        transactionService = new TransactionService();
        transactionService.repository = mockTransactionRepository;
        transactionService.userRepository = mockUserRepository;
        transactionService.paymentService = mockFlutterwaveService;
    });

    describe('FundAccount', () => {
        it('should successfully fund account when payment is successful', async () => {
            const userId = 'user123';
            const amount = 100;

            // Mock FlutterwaveService
            mockFlutterwaveService.MockFlutterwavePayment.mockResolvedValue({ status: 'success' });

            // Mock TransactionRepository
            mockTransactionRepository.UpdateUserBalance.mockResolvedValue({ balance: 100 });
            mockTransactionRepository.CreateRecord.mockResolvedValue({
                userId,
                type: 'fund',
                amount,
                status: 'completed'
            });

            // Mock FormatData
            FormatData.mockImplementation(data => data);

            const result = await transactionService.FundAccount({ userId, amount });

            expect(mockFlutterwaveService.MockFlutterwavePayment).toHaveBeenCalledWith(amount);
            expect(mockTransactionRepository.UpdateUserBalance).toHaveBeenCalledWith({ userId, amount });
            expect(mockTransactionRepository.CreateRecord).toHaveBeenCalledWith({
                userId,
                type: 'fund',
                amount,
                status: 'completed'
            });

            expect(result).toEqual({
                message: 'User funds successfully',
                data: {
                    user: { balance: 100 },
                    record: {
                        userId,
                        type: 'fund',
                        amount,
                        status: 'completed'
                    }
                }
            });
        });

        it('should return payment failed message when payment is unsuccessful', async () => {
            const userId = 'user123';
            const amount = 100;

            // Mock FlutterwaveService
            mockFlutterwaveService.MockFlutterwavePayment.mockResolvedValue({ status: 'failed' });

            // Mock FormatData
            FormatData.mockImplementation(data => data);

            const result = await transactionService.FundAccount({ userId, amount });

            expect(mockFlutterwaveService.MockFlutterwavePayment).toHaveBeenCalledWith(amount);
            expect(mockTransactionRepository.UpdateUserBalance).not.toHaveBeenCalled();
            expect(mockTransactionRepository.CreateRecord).not.toHaveBeenCalled();

            expect(result).toEqual({
                message: 'Payment Failed',
            });
        });

        it('should throw an APIError when an exception occurs', async () => {
            const userId = 'user123';
            const amount = 100;

            // Mock FlutterwaveService to throw an error
            mockFlutterwaveService.MockFlutterwavePayment.mockRejectedValue(new Error('Payment service error'));

            await expect(transactionService.FundAccount({ userId, amount })).rejects.toThrow('Unable to Fund Account');
        });
    });
});
