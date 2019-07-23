'use strict'

const conn = require('../Connection/connect')

exports.getDestinasi = (req,res) =>{
    let sql = 'SELECT * FROM tb_destination'
    
    conn.query(sql, (err, rows) =>{
        if (err) {
            res.status(400).json({
                message:err
            })
        }else{
            res.send({
                data:rows
            })
        }
    })
}