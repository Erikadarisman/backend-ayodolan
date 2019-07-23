
'use strict'

module.exports = function(apps) {
  const controler1 = require('../Controller/Authcontroller')
  const controller = require("../Controller/controller");

  const auth = require('../middleware/authToken')


  //image
  const multer = require("multer");

  const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./uploads");
    },
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  });

  let upload = multer({ storage: storage });
  //~image

  const users = require("../Controller/UserController");
  apps.get("/users", users.showAll);
  apps.post("/users", upload.single("image"), users.register);
  apps.get("/users/:id", users.showById);
  apps.patch("/users/:id", users.update);
  apps.delete("/users/:id", users.delete);

  apps.get('/login',controler1.login)
  apps.post('/change/:id', controler1.changePwd)
  apps.get('/mailer', controler1.sendMail)
  apps.get("/", auth , controller.hello);

};
