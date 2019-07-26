
'use strict'

module.exports = function(apps) {
  const controler1 = require('../Controller/Authcontroller');
  const users = require("../Controller/UserController");
  const controller = require("../Controller/controller");

  const auth = require('../middleware/authToken');
  const destinasi = require('../Controller/destinasiController');
  const guide = require('../Controller/guideController');
  const order = require('../Controller/orderController')
  const paket = require('../Controller/paketControlller')

 


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

  apps.post('/login',controler1.login)
  apps.post('/change/:id', controler1.changePwd)
  apps.post('/mailer', controler1.sendMail)
  apps.get("/", auth , controller.hello);

  apps.post('/singleorder/notif', paket.notification);

  apps.get("/destinasi", destinasi.getDestinasi)
  apps.get('/populardes', destinasi.popularDestination)


  apps.post('/guide/login',guide.login);
  apps.post('/guide/change/:id', guide.changePwd)
  apps.post('/guide/mailer', guide.sendMail)
  apps.get('/guide/:id', guide.showById)

  
  apps.get('/order/:id_user', order.getOrder)
  apps.post('/order', order.postOrder)
  apps.post('/transaksi', order.postTransaksi)
  apps.get('/transaksi', order.getTransaksi)

  apps.get('/transaksiByid', order.getTransaksiByIdTransaksi)

  apps.patch('/updateStatusOrder', order.updateStatusOrder)


  apps.get('/paket', paket.getPaket)
  apps.get('/detailpaket', paket.detailPaket)

  apps.get('/historyGuide/:id_guide', order.getOrderGuide)


  apps.get('/booking', order.postBooking)
};
