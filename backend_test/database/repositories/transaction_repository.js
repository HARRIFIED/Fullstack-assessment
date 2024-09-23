const {TransactionModel, UserModel} = require('../models');
const {
    APIError,
    BadRequestError,
    STATUS_CODES,
} = require("../../utils/app-errors");

class TransactionRepository extends BadRequestError {
    async CreateRecord({
           userId,
           type,
           amount,
           status
       }) {
        try {
            const newTransaction = new TransactionModel({
                userId,
                type,
                amount,
                status
            })
            return await newTransaction.save();
        }catch (err) {
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Create Transaction Record"
            );
        }
    }

    async UpdateUserBalance({userId, amount}) {
        try {
            const record = await UserModel.findByIdAndUpdate(
                userId,
                { $inc: { balance: amount } },
                { new: true }
            )

            if (!record) {
                console.log("User not found")
            }

            console.log("record", record)
            return record
        } catch (err) {
            if (err instanceof APIError) {
                throw err;
            }
            throw new APIError(
                "API Error",
                STATUS_CODES.INTERNAL_ERROR,
                "Unable to Find And Update User Balance"
            );
        }
    }
}

module.exports = TransactionRepository;

