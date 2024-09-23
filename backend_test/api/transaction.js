const TransactionService = require('../services/transaction_service');
const checkAuth = require('./middlewares/checkAuth');

module.exports = (app) => {
    const service = new TransactionService();
    app.post('/transaction/fund', checkAuth, async (req, res, next) => {
        try {
            const { amount } = req.body;
            const {_id} = req.user;

            const {data} = await service.FundAccount({ userId: _id, amount });
            return res.json(data);
        } catch(err) {
            next(err)
        }
    })
    app.post('/transaction/transfer', checkAuth, async (req, res, next) => {
        try {
            const {_id} = req.user;
            const { recipientId, amount } = req.body;

            const {data} = await service.TransferFund({ senderId: _id, recipientId, amount });
            res.json(data);
        } catch(err) {
            next(err)
        }
    })
    app.post('/transaction/withdraw', checkAuth, async (req, res, next) => {
        try {
            const {_id} = req.user;
            const { amount } = req.body;

            const {data} = await service.WithdrawFunds({ userId: _id, amount });
            return res.json(data);
        } catch(err) {
            next(err)
        }
    })
    app.get('/transaction/balance', checkAuth, async (req, res, next) => {
        try {
            const {_id} = req.user;
            const {data} = await service.GetBalance(_id)
            return res.json(data);
        } catch(err) {
            next(err)
        }
    })

};
