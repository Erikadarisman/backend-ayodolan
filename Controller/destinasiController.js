'use strict'

const conn = require('../Connection/connect')
const isEmpty = require('lodash.isempty')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-16054.c16.us-east-1-2.ec2.cloud.redislabs.com:16054',
    auth_pass: 'qg8BcWioB7XiUdPxN3FZX1CqzAv8q2rf'
})

exports.getDestinasi = (req,res) =>{
    let limit = req.query.limit
    let sql = 'SELECT * FROM tb_destination order by id_destination '

    if (!isEmpty(limit)) {
        sql += `limit ${limit}`
    }

    let redisKey = 'destinasi:rows'
    return client.get(redisKey, (err, rows) =>{
        if (rows) {
            res.send({
                data:JSON.parse(rows)
            })
            client.del(redisKey)
        }else{
            conn.query(sql, (err, rows) =>{
                if (err) {
                    res.status(400).json({
                        message:err
                    })
                }else{
                    client.setex(redisKey, 3600, JSON.stringify(rows))
                    res.send({
                        data:rows
                    })
                }
            })
        }
    })
}

exports.popularDestination = (req,res) =>{
    let sql = 'SELECT * FROM `tb_order` left join tb_destination on tb_order.id_destination = tb_destination.id_destination order by id_order'

    let redisKey = 'pupular: rows'

    return client.get(redisKey, (err, rows) =>{
        if (rows) {
            res.send({
                data:JSON.parse(rows)
            })
        }else{
            conn.query(sql, (err, rows) =>{
                if (err) {
                    res.status(400).json({
                        message:err
                    })
                }else{
                    client.setex(redisKey, 3600, JSON.stringify(rows))
                    res.send({
                        data:rows
                    })
                }
            })
        }
    })

    
}