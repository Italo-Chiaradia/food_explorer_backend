const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers;

  if (!authHeader.cookie) {
    throw new AppError("JWT Token não informado", 401);
  }

  const [, token] = authHeader.cookie.split("=");

  try {
    const {subject: user_id} = verify(token, authConfig.jwt.secret);

    request.user = {
      id: Number(user_id)
    };

    return next();
  } catch {
    throw new AppError("JWT token inválido", 401);
  }
}

module.exports = ensureAuthenticated;