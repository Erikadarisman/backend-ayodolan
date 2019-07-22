'use strict'

module.exports = function(apps){
    //======================================
    //IMPORT CONTROLLER NAME
    const controler1 = require('../Controller/Authcontroller')
    apps.get('/',controler1.hello)
}