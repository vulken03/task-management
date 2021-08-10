require("dotenv").config();
const express = require("express");
const api = require("./routes/index");
global._DB = require("./database"); // TODO: store this in global object global._DB & use this instead of using require!
const { errorHandler } = require("./utils/error");
const middleware = require("./middleware");

const app = express();

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
