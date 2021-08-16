require("dotenv").config();
const express = require("express");
const api = require("./routes/index");
const { errorHandler } = require("./utils/error");
const middleware = require("./middleware");
const app = express();
global._DB = require("./database");
global.__basedir = __dirname;
middleware(app);

api(app);

app.use(errorHandler);

const PORT = process.env.PORT;

_DB.sequelize
  .sync({ alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port no ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while syncing database...", err);
  });
