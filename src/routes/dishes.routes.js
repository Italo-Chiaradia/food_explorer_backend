const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const DishesController = require("../controllers/DishesController");
const {Router} = require("express");

const dishesRoutes = Router();
const dishesController = new DishesController();

dishesRoutes.post("/", ensureAuthenticated, dishesController.create);
dishesRoutes.put("/:id", ensureAuthenticated, dishesController.update);
dishesRoutes.delete("/:id", ensureAuthenticated, dishesController.delete);
dishesRoutes.get("/", ensureAuthenticated, dishesController.index);
dishesRoutes.get("/:id", ensureAuthenticated, dishesController.show);



module.exports = dishesRoutes;