'use strict'

const conn = require('../Connection/connect')
const isEmty = require('lodash.isempty')

exports.postOrder = (req,res) =>{
    let {id_user, id_guide,id_destination, date, status} = req.body
    let sql = `insert into tb_order set id_user=?, id_guide=?, id_destination=?, date=?, status=?`
    conn.query(sql,[id_user,id_guide, id_destination,date,status], (err, rows)=>{
        if (err) {
            res.send({
                message:err
            })
        }else{
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

    conn.query(sql, (err, rows) =>{
        if (err) {
            res.send({
                message: err
            })
        }else{
            res.send({
                data: rows
            })
        }
    })
}


