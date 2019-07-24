'use strict'

const conn = require('../Connection/connect')
const isEmty = require('lodash.isempty')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-16054.c16.us-east-1-2.ec2.cloud.redislabs.com:16054',
    auth_pass: 'qg8BcWioB7XiUdPxN3FZX1CqzAv8q2rf'
})

exports.postOrder = (req,res) =>{
    let {id_user, id_guide,id_destination, date, status} = req.body
    let sql = `insert into tb_order set id_user=?, id_guide=?, id_destination=?, date=?, status=?`
    conn.query(sql,[id_user,id_guide, id_destination,date,status], (err, rows)=>{
        if (err) {
            res.status(400).json({
                message:err
            })
        }else{
            client.del(redisKey)
            res.send({
                message:'data has been saved'
            })
        }
    })
}

exports.getOrder = (req,res) =>{
    let id = req.body.id
    let status = req.body.status
    let sql = `select tb_user.username,tb_guide.NIK, tb_guide.guide_name, tb_destination.price from tb_order join tb_user on tb_user.user_id = tb_order.id_user join tb_destination on tb_destination.id_destination = tb_order.id_destination join tb_guide on tb_guide.id_guide = tb_order.id_guide `

    if (!isEmty(id)) {
        sql += `WHERE tb_user.user_id = ${id}`
        if (!isEmty(status)) {
            sql += ` and tb_order.status = ${status}`
        }
    }

    let redisKey = 'order:rows'

    return client.get(redisKey, (err, rows)=>{
        if (rows) {
            res.send({
                data: JSON.parse(rows)
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
                        data: rows
                    })
                }
            })
        }
    })
}


