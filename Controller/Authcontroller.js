'use strict'
const conn = require('../Connection/connect')
const response = require('../response/response')
const jwt = require('jsonwebtoken')

exports.hello = (req,res) =>{
    let {email, password} = req.body
    let sql = `select * from tb_user where email = ${email}`

    conn.query(sql, (err, rows) =>{
        if (err) {
            res.send({
                message:'error gan'
            })
        }else{
            if (email === rows.email && password === rows.password) {
                const user = email
                var token = jwt.sign({ user }, 'jwtToken');

                res.send({
                    data: rows,
                    token: token
                })
            }else{
                res.send({
                    message:'password salah'
                })
            }
        }
    })
}