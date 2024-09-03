const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");
require("express-async-errors");
const cors = require("cors");

const app = express();

const PORT = 3333;

app.use(express.json());
app.use(cors());
app.use(routes);
app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.error(error.message);

  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  })
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));