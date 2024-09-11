require("express-async-errors");
require("dotenv/config");
const migrationsRun = require("./database/sqlite/migrations");
const uploadConfig = require("./configs/uploads");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3333;
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://foodexplorer-main.netlify.app/"],
  credentials: true
}));
migrationsRun();
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