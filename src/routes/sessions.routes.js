const SessionsController = require("../controllers/SessionsController");
const {Router} = require("express");

const sessionsController = new SessionsController();
const sessionsRoutes = Router();

sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;