'use strict'
const conn = require('../Connection/connect')
const response = require('../response/response')

exports.showAll = (req,res) =>{   
    conn.query('select * from tb_user', (error, rows) =>{
        if (error) {
            console.log(error)                                                                                                                                                                                                                            
        }else {
            response.fulfield(rows, res);
        }
    })
}