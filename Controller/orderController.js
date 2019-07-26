'use strict'

const conn = require('../Connection/connect')
const isEmty = require('lodash.isempty')
const redis = require('redis')
const client = redis.createClient({
    url: 'redis://redis-16054.c16.us-east-1-2.ec2.cloud.redislabs.com:16054',
    auth_pass: 'qg8BcWioB7XiUdPxN3FZX1CqzAv8q2rf'
})

exports.postOrder = (req,res) =>{
    let {id_user, id_destination, id_transaksi, category} = req.body
    const tanggal = req.body.date;
    let sql = `insert into tb_order set id_user=${id_user}, id_destination=${id_destination}, id_transaksi=${id_transaksi},  category=${category}, order_status=?`
    conn.query(sql,[0], (error, rows)=>{
        if (error) {
            res.status(400).json({
                message:error
            })
        }else{
            conn.query('select id_order from tb_order ORDER BY id_order DESC limit 1', (errorr, rowss)=>{
                if (errorr) {
                    console.log(errorr)
                } else {
                    let id_order = rowss[0].id_order
                    let guide = 'SELECT a.*  FROM tb_guide a WHERE NOT EXISTS(SELECT * FROM tb_booking b WHERE a.id_guide = b.id_guide AND b.date LIKE ?) ORDER BY sum_order ASC LIMIT 1'
                    conn.query(guide,["%"+tanggal+"%",] ,(errorrr, rowsss)=>{
                        if(errorrr){
                            console.log(errorrr)
                        }else{
                            if(rowsss[0]==undefined){
                                res.send({
                                    message:'Guide Habis'
                                })
                            }else{
                                const idGuide = rowsss[0].id_guide
                                let insertBooking = `INSERT INTO tb_booking set id_order=${id_order}, id_guide=${idGuide}, date=?`
                                conn.query( insertBooking,[tanggal], (errorrrr, rowssss)=>{
                                        if(errorrrr){
                                            console.log(errorrrr)
                                        }else{
                                            let getSum = `select sum_order from tb_guide where id_guide=${idGuide} limit 1`
                                            conn.query(getSum, (errorrrrr, rowsssss)=>{
                                                if(errorrrrr){
                                                    console.log(errorrrrr)
                                                }else{
                                                    let sumOrder= rowsssss[0].sum_order + 1
                                                    console.log(sumOrder)
                                                    let addSum =`UPDATE tb_guide set sum_order=? WHERE id_guide=?`
                                                    conn.query(addSum,[sumOrder,idGuide], (errorrrrrr, rowssssss)=>{
                                                        if(errorrrrrr){
                                                            console.log(errorrrrrr)
                                                        }else{
                                                            let transaksi =`UPDATE tb_transaksi set keterangan=? WHERE id_transaksi=?`
                                                            conn.query(transaksi, ['SUCCESS', id_transaksi], (errorrrrrrr, rowsssssss)=>{
                                                                if(errorrrrrrr){
                                                                    console.log(errorrrrrrr)
                                                                }else{
                                                                    res.status(200).send({
                                                                        message: 'data has been saved'
                                                                    })
                                                                }
                                                            })
                                                            
                                                        } 
                                                    })
                                                }
                                            })
                                            
                                        }
                                    }
                                )
                            }
                        }
                    })
                }
            })
        }
    })
}

exports.getOrder = (req,res) =>{
    let id_user      = req.params.id_user 

    let sql = `SELECT a.*, b.*, c.name as nama_user, c.image as image_user, d.guide_name, d.image as image_guide,d.email as email_guide, d.no_phone as phone_guide, e.destination, e.image as image_destination, e.price from tb_order as a 
    join tb_booking as b on a.id_order = b.id_order 
    join tb_user as c on c.user_id = a.id_user 
    join tb_guide as d on d.id_guide = b.id_guide 
    join tb_destination as e on a.id_destination=e.id_destination
    WHERE a.id_user=${id_user}`

    conn.query(sql,(error, rows)=>{
        if(error){
            res.status(400).send({
                message:error
            })
        }else{
            res.status(200).send({
                data:rows
            })
        }
    })
}

exports.postTransaksi = (req,res) =>{
    let {id_transaksi,keterangan, va, dn, id_user, id_destination, price_order, date} = req.body

    let cekGuide = `SELECT a.*  FROM tb_guide a WHERE NOT EXISTS(SELECT * FROM tb_booking b WHERE a.id_guide = b.id_guide AND b.date LIKE ?) ORDER BY sum_order ASC LIMIT 1`

    conn.query(cekGuide, [date], (error, rows)=>{
        if(error){
            res.status(400).send({
                message:error
            })
        }else{
            if(rows[0]==undefined){
                res.status(400).send({
                    message:'Guide Habis'
                })
            }else{
                let sql = 'insert into tb_transaksi set id_transaksi=? ,keterangan=?, virtual_account=?, displayName=?, id_user=?, id_destination=?, price_order=?, date=?'
                conn.query(sql,[id_transaksi,keterangan, va, dn, id_user, id_destination, price_order, date], (err, rows)=>{
                    if (err) {
                        res.status(400).send({
                            message:err
                        })
                    }else{
                        res.status(200).send({
                            message:'data has been saved'
                        })
                    }
                })
            }
        }
    })
}


exports.postBooking = (req,res) =>{

    let guide = 'SELECT a.*  FROM tb_guide a WHERE NOT EXISTS(SELECT * FROM tb_booking b WHERE a.id_guide = b.id_guide) ORDER BY sum_order ASC LIMIT 1'
    conn.query(guide, (err, rows)=>{
        if(err){
            res.status(400).send({
                    message:err
                })
        }else{
            let idGuide = rows[0].id_guide
            conn.query(
                `Insert into tb_booking set id_guide=${idGUide}`
            )
        }
    })
}



exports.getTransaksi = (req,res) =>{
    let id = req.query.id
    
    let sql = `SELECT * FROM tb_transaksi as a 
    join tb_user as b on a.id_user = b.user_id 
    join tb_destination as c on a.id_destination = c.id_destination 
    where a.id_user =${id}`

    conn.query(sql, (err, rows)=>{
        if (err) {
            res.status(400).json({
                message:err
            })
        }else{
            if (isEmty(rows)) {
                res.status(400).json({
                    message:'data not found'
                })
            }else{
                res.status(200).send({
                    data: rows
                })
            }
        }
    })
}

exports.getOrderGuide = (req,res) =>{
    let id_guide      = req.params.id_guide

    let sql = `SELECT a.*, b.*, c.name as nama_user, c.image as image_user, d.guide_name, d.image as image_guide from tb_order as a 
    join tb_booking as b on a.id_order = b.id_order 
    join tb_user as c on c.user_id = a.id_user 
    join tb_guide as d on d.id_guide = b.id_guide 
    WHERE b.id_guide=${id_guide}`

    conn.query(sql,(error, rows)=>{
        if(error){
            res.status(400).send({
                message:error
            })
        }else{
            res.status(200).send({
                data:rows
            })
        }
    })
}


exports.getTransaksiByIdTransaksi = (req,res) =>{
    let id = req.query.idTransaksi
    
    let sql = `SELECT a.*, b.*, c.* from tb_order as a 
    join tb_user as b on a.id_user = b.user_id 
    join tb_destination as c on c.id_destination = a.id_destination 
    WHERE a.id_transaksi=${id}`

    conn.query(sql, (err, rows)=>{
        if (err) {
            res.status(400).json({
                message:err
            })
        }else{
            if (isEmty(rows)) {
                res.status(400).json({
                    message:'data not found'
                })
            }else{
                res.status(200).send({
                    data: rows
                })
            }
        }
    })
}

// update status order from table order when user is picked up

exports.updateStatusOrder = (req,res) =>{
    let id = req.query.idTransaksi
    
    let sql = `Update tb_order set order_status=? WHERE id_transaksi=${id}`
    conn.query(sql,[1], (err, rows)=>{
        if (err) {
            res.status(400).json({
                message:err
            })
        }else{
            if (isEmty(rows)) {
                res.status(400).json({
                    message:'data not found'
                })
            }else{
                res.status(200).send({
                    data: rows
                })
            }
        }
    })
}