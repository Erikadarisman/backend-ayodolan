//for connetion api to database
require('dotenv/config')
const mysql = require('mysql')

const connect = mysql.createConnection({
    host: process.env.HOST,
    user:process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connect.connect (function(err){
    if(err){
        throw err;
    }
})

module.exports = connect