'use strict'

const conn = require('../Connection/connect')
const isEmpty = require('lodash.isempty')

exports.getPaket = (req,res) =>{
    let id = req.body.id
    let sort = true

    let sql =`SELECT * FROM tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_list = tb_list_destinasi_paket.id_list join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination `

    if (!isEmpty(id)) {
        sql += `where tb_list_destinasi_paket.id_destination = ${id}`
    }

    conn.query(sql, (err, rows) =>{
        if (err) {
            res.status(400).send({
                message: err
            })
        }else{
            if (isEmpty(rows)) {
                res.status(400).send({
                    message:'data not found'
                })
            }else{
                res.send({
                    data:rows
                })
            }
           
        }
    })

}

