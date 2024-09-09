const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class DishesImgController {
  async update(request, response) {
    const {id} = request.params;
    const imgFilename = request.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({id}).first();

    if (!dish) {
      throw new AppError("Esse prato não existe!");
    }

    if (dish.img) {
      await diskStorage.deleteFile(dish.img);
    }

    const filename = await diskStorage.saveFile(imgFilename);

    dish.img = filename;

    await knex("dishes").update(dish).where({id});

    return response.json(dish);
  }
}

module.exports = DishesImgController;