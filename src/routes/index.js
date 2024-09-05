const sessionsRouter = require("./sessions.routes");
const dishesRouter = require("./dishes.routes");
const usersRouter = require("./users.routes");
const {Router} = require("express");

const routes = Router();

routes.use("/sessions", sessionsRouter);
routes.use("/dishes", dishesRouter);
routes.use("/users", usersRouter);

module.exports = routes;