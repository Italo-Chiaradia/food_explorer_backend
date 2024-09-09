const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const DishesImgController = require("../controllers/DishesImgController");
const DishesController = require("../controllers/DishesController");
const uploadConfig = require("../configs/uploads");

const {Router} = require("express");

const dishesImgController = new DishesImgController();
const dishesController = new DishesController();
const dishesRoutes = Router();


const multer = require("multer");
const upload = multer(uploadConfig.MULTER);

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get("/", dishesController.index);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.post("/", verifyUserAuthorization("admin"), dishesController.create);
dishesRoutes.put("/:id", verifyUserAuthorization("admin"), dishesController.update);
dishesRoutes.delete("/:id", verifyUserAuthorization("admin"), dishesController.delete);
dishesRoutes.patch("/:id", verifyUserAuthorization("admin"), upload.single("img"), dishesImgController.update);

module.exports = dishesRoutes;