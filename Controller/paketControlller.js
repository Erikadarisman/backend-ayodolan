'use strict'

const conn = require('../Connection/connect')
const isEmpty = require('lodash.isempty')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-16054.c16.us-east-1-2.ec2.cloud.redislabs.com:16054',
    auth_pass: 'qg8BcWioB7XiUdPxN3FZX1CqzAv8q2rf'
})

exports.getPaket = (req,res) =>{
    let id = req.query.id

    let sql =`SELECT * FROM tb_paket_wisata join tb_list_destinasi_paket on tb_list_destinasi_paket.id_paket = tb_paket_wisata.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination `

    if (!isEmpty(id)) {
        sql += `WHERE tb_destination.id_destination = ${id}`
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

exports.detailPaket = (req,res) =>{
    let id_paket = req.query.id_paket
    let sqlimage = `select image, tb_destination.destination, tb_destination.id_destination from tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_paket = tb_list_destinasi_paket.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination where tb_paket_wisata.id_paket = ${id_paket}`

    let sqlprice = `select tb_destination.price from tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_paket = tb_list_destinasi_paket.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination where tb_paket_wisata.id_paket = ${id_paket}`

    let sql = `select * from tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_paket = tb_list_destinasi_paket.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination where tb_paket_wisata.id_paket = ${id_paket}`


    conn.query(sql,(err, row) =>{
        if (err) {
            res.status(400).send({
                message:err
            })
        }else{
            if (isEmpty(row)) {
                res.status(400).send({
                    message: 'data empty'
                })
            }else{
                conn.query(sqlimage,(err, image)=>{
                    if (err) {
                        res.status(400).send({
                            message:err
                        })
                    }else{
                        if (isEmpty(row)) {
                            res.status(400).send({
                                message: 'data empty'
                            })
                        }else{
                            conn.query(sqlprice, (err, price)=>{
                                if (err) {
                                    res.status(400).send({
                                        message: 'data empty'
                                    })
                                }else{
                                    if (isEmpty(row)) {
                                        res.status(400).send({
                                            message: 'data empty'
                                        })
                                    }else{
                                        res.status(200).send({
                                            data: row,
                                            image: image,
                                            price: price
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
                
            }
        }
    })
}
