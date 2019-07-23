const jwt = require('jsonwebtoken')
const conn = require('../Connection/connect')
const isEmpty = require('lodash.isempty')

module.exports = (req,res,next) =>{
    const token = req.body.token;
    if (!token) {
        return res.status(401).send('Access denied. No JWT provided.');
    }
 
    try {
        const decoded = jwt.verify(token, 'jwtToken');
        const email = decoded.user
        conn.query(`select * from tb_user where email = '${email}'`, (err, rows) =>{
            if (err) {
                res.send({
                    message: err
                })
            }else{
                if (isEmpty(rows)) {
                   res.send({
                        message:'invaild token'
                   })
                }else{
                   next();
                }
            }
        })
        
    }
    catch (ex) {
        res.status(400).send('Invalid JWT.');
    }
}