'use strict'

const conn = require('../Connection/connect')

exports.getDestinasi = (req,res) =>{
    let sql = 'SELECT DISTINCT tb_destination.id_destination FROM tb_foto_destination join tb_destination on tb_foto_destination.id_destination = tb_destination.id_destination'
    let sqldef = 'SELECT * tb_destination.id_destination FROM tb_foto_destination join tb_destination on tb_foto_destination.id_destination = tb_destination.id_destination'
    conn.query(sql, (err, rows) =>{
        if (err) {
            res.send({
                message: err
            })
        }else{
            let val = []
            let i = 0
            let data = rows 

            data.map((item) =>{
                val[i] = item.id_destination
                i++
            })

            conn.query(sqldef, (err, row) =>{
                if (err) {
                    res.send({
                        message:err
                    })
                }else{
                    let datas = row
                    let j = 0
                    datas.map((items) =>{
                        if (items.id_destination == val[j]) {
                            
                        }
                    })
                }
            })
        }
    })
}