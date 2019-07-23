
'use strict'

module.exports = function(apps) {
  const controler1 = require('../Controller/Authcontroller');
  const users = require("../Controller/UserController");
  const controller = require("../Controller/controller");

  const auth = require('../middleware/authToken');
  const destinasi = require('../Controller/destinasiController');
  const guide = require('../Controller/guideController');



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

  apps.get("/users", users.showAll);
  apps.post("/users", upload.single("image"), users.register);
  apps.get("/users/:id", users.showById);
  apps.patch("/users/:id", upload.single('image') ,users.update);
  apps.delete("/users/:id", users.delete);

  apps.get('/login',controler1.login)
  apps.post('/change/:id', controler1.changePwd)
  apps.get('/mailer', controler1.sendMail)
  apps.get("/", auth , controller.hello);


  apps.get("/destinasi", destinasi.getDestinasi)

  apps.get("/guide", guide.showAll);
  apps.get("/guide/:id", guide.showById);
  apps.patch("/guide/:id", upload.single('image') ,guide.update);
  apps.delete("/guide/:id", guide.delete);

};
