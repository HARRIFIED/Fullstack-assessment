const { TransactionRepository, UserRepository } = require("../database");
const { APIError, STATUS_CODES } = require('../utils/app-errors');
const {FormatData} = require("../utils")
const FlutterwaveService = require("./flutterwave_service");


class TransactionService {
    constructor() {
        this.repository = new TransactionRepository();
        this.paymentService = new FlutterwaveService();
        this.userRepository = new UserRepository();
    }

    async FundAccount({userId, amount}) {
        try {
            const paymentResult = await this.paymentService.MockFlutterwavePayment(amount);
            if (paymentResult.status === 'success') {

                const user = await this.repository.UpdateUserBalance({userId, amount});

                const record = await this.repository.CreateRecord({
                    userId,
                    type: 'fund',
                    amount,
                    status: 'completed'
                });

                return FormatData({
                    message: 'User funds successfully',
                    data: {
                        user: user,
                        record: record
                    }
                })
            } else {
                return FormatData({
                    message: 'Payment Failed',
                })
            }

        } catch(err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Fund Account"
            );
        }
    }

    async TransferFund ({ senderId, recipientId, amount }) {
        try {
            const sender = await this.userRepository.FindUserById(senderId);
            if (sender?.balance < amount) {
                return FormatData({
                    message: 'Insufficient funds',
                })
            }

            const recipient = await this.userRepository.FindUserById(recipientId);
            if (!recipient) {
                return FormatData({
                    message: 'Recipient not found',
                })
            }

            // Update balances
            const user = await this.repository.UpdateUserBalance({userId: senderId, amount: -amount});
            await this.repository.UpdateUserBalance({userId: recipientId, amount: amount});

            const record = await this.repository.CreateRecord({
                userId: senderId,
                recipientId,
                type: 'transfer',
                amount,
                status: 'completed'
            });

            return FormatData({
                message: 'Transfer Successful',
                data: {
                    ...record?._doc,
                    balance: user?.balance,
                }
            })
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Transfer Fund"
            );
        }
    }

    async WithdrawFunds({ userId, amount }) {
        try {
            const user = await this.userRepository.FindUserById(userId);
            if (user?.balance < amount) {
                return FormatData({
                    message: 'Insufficient funds',
                })
            }

            const userBal = await this.repository.UpdateUserBalance({userId, amount: -amount});

            const record = await this.repository.CreateRecord({
                userId,
                type: 'withdraw',
                amount,
                status: 'completed'
            });

            return FormatData({
                message: 'Withdrawal Successful',
                data: {
                    ...record?._doc,
                    balance: userBal?.balance,
                }
            })
        } catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Withdraw Fund"
            );
        }
    }

    async GetBalance(_id) {
        try {
            const user = await this.userRepository.FindUserById(_id);
            return FormatData({
                message: 'Balance Retrieved Successful',
                data: user?.balance
            })
        } catch(err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Get Balance"
            );
        }
    }
}

module.exports = TransactionService;