'use strict'
const conn = require('../Connection/connect')
const response = require('../response/response')

exports.hello = (req,res) =>{   
    response.ok('welcome in ayodolan with express js', res);
}