'use strict'
 
const conn = require('../Connection/connect')
const isEmpty = require('lodash.isempty')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-16054.c16.us-east-1-2.ec2.cloud.redislabs.com:16054',
    auth_pass: 'qg8BcWioB7XiUdPxN3FZX1CqzAv8q2rf'
})
require('dotenv/config')

 
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

exports.notification = (req,res) =>{
    let message_content = req.body.msg;
    let phoneID = req.body.phoneid;
    let header = req.body.header;

    var sendNotification = function (data) {
        var headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic NmY3MDQwM2EtY2JjMC00YjQ3LWJhMDUtZTJhMzIxMGRiNzBj"
        };

        var options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };

        var https = require('https');
        var onesignalreq = https.request(options, function (res) {
            res.on('data', function (data) {
                console.log("Response:");
                console.log(JSON.parse(data));
            });
        });

        onesignalreq.on('error', function (e) {
            console.log("ERROR:");
            console.log(e);
        });

        onesignalreq.write(JSON.stringify(data));
        onesignalreq.end();
    };

    var message = {
        app_id: "7f3ad7b9-c240-47d5-bdb2-21bd7a14ff04",
        contents: { "en": `${message_content}` },
        headings: {"en": `${header}`},
        include_player_ids: [`${phoneID}`]
    };

    sendNotification(message);
    res.status(200).send("Notification sended");

}
 
exports.detailPaket = (req,res) =>{
    let id_paket = req.query.id_paket
    let sqlimage = `select image from tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_paket = tb_list_destinasi_paket.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination where tb_paket_wisata.id_paket = ${id_paket}`

    let sqlprice = `select tb_destination.price, tb_destination.destination, tb_destination.id_destination from tb_list_destinasi_paket join tb_paket_wisata on tb_paket_wisata.id_paket = tb_list_destinasi_paket.id_paket join tb_destination on tb_destination.id_destination = tb_list_destinasi_paket.id_destination where tb_paket_wisata.id_paket = ${id_paket}`


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
                                        let harga = price
                                        let totalHarga = 0

                                        harga.map((item) =>{
                                            totalHarga += item.price
                                        })

                                        let potongan = totalHarga * (10/100)
                                        let hargaAkhir = (totalHarga - potongan) * 4
                                       

                                        res.status(200).send({
                                            data: row,
                                            image: image,
                                            price: price,
                                            total: hargaAkhir
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