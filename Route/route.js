'use strict'

module.exports = function(apps){
    //======================================
    //IMPORT CONTROLLER NAME
    const controler1 = require('../Controller/Authcontroller')
    apps.get('/login',controler1.login)
    apps.post('/change/:id', controler1.changePwd)
    apps.get('/mailer', controler1.sendMail)
}