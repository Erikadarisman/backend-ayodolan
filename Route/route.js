"use strict";

module.exports = function(apps) {
  const controller = require("../Controller/controller");
  apps.get("/", controller.hello);



  const users = require("../Controller/UserController");
  apps.get("/users", users.showAll);
  apps.post("/users", users.register);
  apps.delete("/users/:id", users.delete);

};
