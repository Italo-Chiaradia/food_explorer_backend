const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const DishesController = require("../controllers/DishesController");
const {Router} = require("express");

const dishesRoutes = Router();
const dishesController = new DishesController();

const multer = require("multer");
const uploadConfig = require("../configs/uploads");
const upload = multer(uploadConfig.MULTER);

dishesRoutes.post("/", ensureAuthenticated, dishesController.create);
dishesRoutes.put("/:id", ensureAuthenticated, dishesController.update);
dishesRoutes.delete("/:id", ensureAuthenticated, dishesController.delete);
dishesRoutes.get("/", ensureAuthenticated, dishesController.index);
dishesRoutes.get("/:id", ensureAuthenticated, dishesController.show);

dishesRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), (request, response) => {
  console.log(request.file.filename);
  response.json();
})


module.exports = dishesRoutes;