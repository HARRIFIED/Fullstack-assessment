const UserService = require("../services/user_service");


module.exports = (app) => {
    const service = new UserService();

    app.post("/user/signup", async (req, res, next) => {
        try {
            const { email, password, username } = req.body;
            const { data } = await service.SignUp({ username, email, password });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post("/user/login", async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const { data } = await service.SignIn({ email, password });

            return res.json(data);
        } catch (err) {
            next(err);
        }
    });
};
