const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const {img, title, description, price, category, ingredients} = request.body;
    const {id} = request.user;
    
    const [dish_id] = await knex("dishes").insert({
      user_id:id,
      img,
      title,
      description,
      price,
      category
    });

    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id,
        name
      }
    })

    await knex("ingredients").insert(ingredientsInsert);

    response.json();
  }

  async update(request, response) {
    const {img, title, description, price, category, ingredients} = request.body;
    const {id} = request.params;

    const dish = await knex("dishes").where({id}).first();

    if (!dish) {
      throw new AppError("Esse prato não existe!");
    }

    await knex("ingredients").where({dish_id:id}).delete();

    const ingredientsInsert = ingredients.map(name => {
      return {
        dish_id: id,
        name
      }
    });

    if (ingredientsInsert.length > 0)
      await knex("ingredients").insert(ingredientsInsert);

    dish.img = img ?? dish.img;
    dish.title = title ?? dish.title;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    await knex("dishes").where({id}).update({
      img: dish.img,
      title: dish.title,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      updated_at: knex.fn.now()
    })

    return response.json();
  }

  async delete(request, response) {
    const {id} = request.params;

    await knex("dishes").where({id}).delete();

    return response.json();
  } 

  async index(request, response) {
    const {title, ingredients} = request.query;
    const user_id = request.user.id;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(", ").map(ingredient => ingredient.trim());
      dishes = await knex("ingredients")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.user_id"
        ])
        .where("dishes.user_id", user_id)
        .whereLike("dishes.title", `%${title}%`)
        .whereIn("name", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id")
        .orderBy("dishes.title");
    } else {
      dishes = await knex("dishes")
        .select([
          "dishes.id",
          "dishes.title",
          "dishes.user_id"
        ])
        .where({user_id})
        .whereLike("title", `%${title}%`)
        .orderBy("title");
    }

    const ingredientsNames = await knex("ingredients");

    const dishesWithTags = dishes.map(dish => {
      const dishIngredients = ingredientsNames.filter(i => i.dish_id === dish.id);
      return {
        ...dish,
        ingredients: dishIngredients
      }
    });

    return response.json(dishesWithTags);
  } 

  async show(request, response) {
    const {id} = request.params;

    const dish = await knex("dishes").where({id}).first();
    const ingredients = await knex("ingredients").where({dish_id: id}).orderBy("name");

    return response.json({
      ...dish,
      ingredients
    })
  }
}

module.exports = DishesController;