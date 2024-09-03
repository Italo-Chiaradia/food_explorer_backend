const sqliteConnection = require("../database/sqlite");
const authConfig = require("../configs/auth");
const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const AppError = require("../utils/AppError");

class SessionsController {
  async create(request, response) {
    const {email, password} = request.body;
    
    const database = await sqliteConnection();

    const user = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreto", 401);
    }

    const checkedPassword = await compare(password, user.password);

    if (!checkedPassword) {
      throw new AppError("E-mail e/ou senha incorreto", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.status(201).json({user, token});
  }
}

module.exports = SessionsController;