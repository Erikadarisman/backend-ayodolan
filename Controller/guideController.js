"use strict"

require("dotenv/config");
const isempty = require("lodash.isempty");
const conn = require("../Connection/connect");
const response = require("../response/response");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(7);
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

let random = ''
let email = ''
let id = ''
function acak() {
    random = ''
    let b = '0123456789';
    let c = 6;
    let d = b.length;
    
    for (let i = 0; i < c; i++) {
        random += b.charAt(Math.floor(Math.random() * d));
    }
}

const dataEmpty = () => {
  res.status(400).send({
    message: "Data can't be empty"
  });
};

exports.login = (req,res) =>{
  let {email, password} = req.body
  let sql = `select * from tb_guide where email = '${email}'`

  conn.query(sql, async (err, rows) =>{
      if (err) {
        res.status(400).json({
            message:err
        })
      }else{
          let email_user = ''
          let password_user = ''
          let data = rows
          
          data.map((item) =>{
              email_user = item.email,
              password_user = item.password
          })
        
          let decrypt = await bcrypt.compare(password, password_user)
          if (decrypt) {
              const user = email
              var token = jwt.sign({ user }, 'jwtToken');
              res.send({
                  data: rows,
                  token: token
              })
          }else{
              res.status(400).json({
                  message:'password salah'
              })
          }
      }
  })
}


exports.showAll = (req, res) => {
  conn.query("select * from tb_guide", (error, rows) => {
    if (error) {
        res.status(400).json({
            message:err
        })
    } else {
      response.fulfield(rows, res);
    }
  });
};

exports.showById = (req, res) => {
  let id = req.params.id;
  conn.query(`select * from tb_guide where id_guide = ${id}`, (error, rows) => {
    if (error) {
        res.status(400).json({
            message:err
        })
    } else {
      response.fulfield(rows, res);
    }
  });
};

exports.update = async(req, res) => {
  let image = ''

  if (isempty(req.file)) {
    image = req.body.image
  }else{
    let path = req.file.path;
    let getUrl = async req => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });

      let data;
      await cloudinary.uploader.upload(path, result => {
        const fs = require("fs");
        fs.unlinkSync(path);
        data = result.url;
      });
      return data;
    };

    image = await getUrl();
  }
  
  let id = req.params.id;
  let gender = req.body.gender;
  let no_phone = req.body.no_phone;
  if (!gender && !no_phone) {
    res.status(400).send({
      message: "Data can't be empty"
    });
  } else {
    conn.query(
      `update tb_guide set gender=?, no_phone=?, image=? where user_id = ${id}`,
      [gender, no_phone, image],
      (error, rows) => {
        if (error) {
          console.log(error);
        } else {
          conn.query(
            `select * from tb_guide where id_guide = ${id}`,
            (error, row) => {
              if (error) {
                console.log(error);
              } else {
                res.send({
                  status: 200,
                  dat: row
                });
              }
            }
          );
        }
      }
    );
  }
};

exports.delete = (req, res) => {
  let id = req.params.id;
  if (!id) {
    dataEmpty();
  } else {
    conn.query(`delete from tb_guide where id_guide = ${id}`, (error, rows) => {
      if (error) {
        res.status(400).json({
            message:err
        })
      } else {
        res.send({
          message: "Data Has Been Delete"
        });
      }
    });
  }
};

exports.sendMail = (req,res) =>{
  let checkEmail = req.body.email
  checkEmail = checkEmail.toLowerCase()
  let sql = `select * from tb_guide where email ='${ checkEmail }'`
  acak()
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD_EMAIL
      }
  })

  let mailOptions = {
      from: process.env.EMAIL,
      to: `${checkEmail}`,
      subject: 'Reset Password',
      html: `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1' /><style>.body { background-color: #F9F9F9 } a { color: inherit; text-decoration: none !important; text-decoration: none; } a.cta_button { color: #fff } @media only screen { html { min-height: 100%; background: 0 0 } } @media only screen and (max-width:596px) { .row{ width:100%!important; width:100%; } .fi{ font-size:14px!important; } .ttl, .ttl a{ font-size: 22px!important; } .dscr, .dscr p, .dscr span{ font-size: 18px !important; } .small-12 .dscr{ width: 100%; width:100%!important; min-width:100%; } .small-float-center, .small-text-center { text-align: center !important; } .small-float-center { margin: 0 auto !important; float: none !important; } .small-text-left { text-align: left !important; } .small-text-right { text-align: right !important; } .hide-for-large { display: block !important; width: auto !important; overflow: visible !important; max-height: none !important; font-size: inherit !important; line-height: inherit !important } center{ min-width:0!important; } table.container{ width: 100%!important; } table.body table.container .hide-for-large, table.body table.container .row.hide-for-large { display: table !important; width: 100% !important } table.body table.container .callout-inner.hide-for-large { display: table-cell !important; width: 100% !important } table.body table.container .show-for-large { display: none !important; width: 0; mso-hide: all; overflow: hidden } td.small-1, td.small-10, td.small-11, td.small-12, td.small-2, td.small-3, td.small-4, td.small-5, td.small-7, td.small-8, td.small-9, th.small-1, th.small-10, th.small-11, th.small-12, th.small-2, th.small-3, th.small-4, th.small-5, th.small-7, th.small-8, th.small-9 { display: inline-block !important } table.body img { width: auto; height: auto } table.body center { min-width: 0 !important } table.body .container { width: 95% !important } table.body .column, table.body .columns { height: auto !important; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; } table.body .columns.large-6, table.body .columns.large-4, table.body .columns.large-3{ padding-left: 8px !important; padding-right: 8px !important } table.body .collapse .column, table.body .collapse .columns, table.body .column .column, table.body .column .columns, table.body .columns .column, table.body .columns .columns { padding-left: 0 !important; padding-right: 0 !important } td.small-1, th.small-1 { width: 8.33333% !important } td.small-2, th.small-2 { width: 16.66667% !important } td.small-3, th.small-3 { width: 25% !important } td.small-4, th.small-4, img.small-4 { width: 33.33333% !important } td.small-5, th.small-5 { width: 41.66667% !important } td.small-6, th.small-6, img.small-6 { display: inline-block !important; width: 50% !important } td.small-7, th.small-7 { width: 58.33333% !important } td.small-8, th.small-8 { width: 66.66667% !important } td.small-9, th.small-9 { width: 75% !important } td.small-10, th.small-10 { width: 83.33333% !important } td.small-11, th.small-11 { width: 91.66667% !important } td.small-12, th.small-12, img.small-12 { width: 100% !important } .column td.small-12, .column th.small-12, .columns td.small-12, .columns th.small-12 { display: block !important; width: 100% !important } img.sclbtn{ min-width:24px!important; min-height:24px!important; max-width:100px!important; max-width:100px!important; } }</style></head><body class='body' style='-moz-box-sizing:border-box;-ms-text-size-adjust:100%;-webkit-box-sizing:border-box;-webkit-text-size-adjust:100%;Margin:0;background:#F9F9F9!important;box-sizing:border-box;font-size:1px;margin:0;min-width:100%;padding:0;width:100%!important'><table class='body' id='publicateemailcontainer' style='Margin:0;background:#F9F9F9!important;background-color:#F9F9F9;border-collapse:collapse;border-spacing:0;font-size:1px;height:100%;line-height:0;margin:0;padding:0;vertical-align:top;width:100%'><tbody><tr style='padding:0;vertical-align:top'><td dir='auto' class='float-center' align='center' valign='top' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0 auto;border-collapse:collapse!important;float:none;font-size:1px;line-height:0;margin:0 auto;padding:0;text-align:center;vertical-align:top;word-wrap:break-word;-moz-hyphens: none;-ms-hyphens: none;-webkit-hyphens: none;hyphens: none;'><table width='640' align='center' class='container float-center' style='Margin:0 auto;background:#FFFFFF;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:600px'> <tbody> <tr style='padding:0;vertical-align:top'> <td dir='auto' style='padding:0'><table class='row' border='0' cellpadding='0' cellspacing='0' style='border-collapse:collapse; background-color:transparent; mso-table-lspace:0pt; mso-table-lspace:0pt; mso-table-rspace:0pt;border-spacing:0;display:table;padding:0;position:relative;vertical-align:top;width:100%;margin:0;'><tbody><tr style='padding:0;vertical-align:top' valign='top'><th dir='auto' class='small-12 large-12 columns first last' style='Margin:0 auto;margin:0 auto;padding:0;padding-bottom:15px;padding-top:15px;padding-left:0px;padding-right:0px;width:564px' valign='top'><table style='border-collapse:collapse;border-spacing:0;padding:0;vertical-align:top;width:100%'><tbody><tr style='padding:0;vertical-align:top'><th dir='auto' align='left' style='padding:0;background-color:transparent;Margin:0;color:#555555;font-family:helvetica,arial,verdana,sans-serif;font-size:17px;font-weight:normal;line-height:1.5;margin:0;'><table width='100%' border='0' cellspacing='0' cellpadding='0' style='border-collapse:collapse;border-spacing:0;display:table;padding:0;margin:0;width:100%;'> <tr> <td> <table border='0' cellspacing='0' cellpadding='0' align='center' width='100%'> <tr> <td align='center' style='padding:10px 7px; line-height:1.2!important;text-align:center; border-radius:0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;' bgcolor='transparent'><h2 dir='auto' style='padding: 0; margin: 0!important;line-height: 1.2;display:block;width:auto;border:transparent 1px solid;text-align:center;font-weight:normal;font-style:normal;color:#555555;font-size:32px;background-color:transparent;border-radius:0px; -webkit-border-radius: 0px; -moz-border-radius: 0px;font-family: helvetica,arial,verdana,sans-serif;vertical-align: top;'><span>Code Verification</span></h2></td> </tr> </table> </td> </tr></table></th></tr></tbody></table></th></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr><tr style='padding:0;vertical-align:top'><td dir='auto' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:inherit;font-family:inherit;font-size:1px;font-weight:normal;hyphens:auto;line-height:0;margin:0;padding:0;vertical-align:top;word-wrap:break-word'><![endif]--><table class='row' border='0' cellpadding='0' cellspacing='0' style='border-collapse:collapse; background-color:transparent; mso-table-lspace:0pt; mso-table-lspace:0pt; mso-table-rspace:0pt;border-spacing:0;display:table;padding:0;position:relative;vertical-align:top;width:100%;margin:0;'><tbody><tr style='padding:0;vertical-align:top' valign='top'><th dir='auto' class='small-12 large-12 columns first last' style='Margin:0 auto;margin:0 auto;padding:0;padding-bottom:15px;padding-top:15px;padding-left:6px;padding-right:6px;width:564px' valign='top'><table style='border-collapse:collapse;border-spacing:0;padding:0;vertical-align:top;width:100%'><tbody><tr style='padding:0;vertical-align:top'><th dir='auto' align='left' style='padding:0;background-color:transparent;Margin:0;color:inherit;font-family:helvetica,arial,verdana,sans-serif;font-size:17px;font-weight:normal;line-height:1.5;margin:0;'><table bgcolor='transparent' style='background-color: transparent;border-spacing:0;border-collapse:collapse;padding:0;vertical-align:top;width:100%' width='100%' dir='auto'><tr><td width='100%' height='5' style='font-size:1px; line-height:5px;height:5px;'>&nbsp;</td></tr><tr><td style='padding:0 8px 0 8px;padding-left:8px;padding-right:8px;' dir='auto'><div class='dscr' style='color:#555555;margin:0;font-family: helvetica,arial,verdana,sans-serif; font-size: 14px; font-weight:300; line-height: 1.5;' dir='auto'><span><div style="font-size: 14px; font-family: helvetica, arial, verdana, sans-serif; color: inherit; text-align: center;"><span style="font-size: 42px; color: #e74c3c;"><em><strong><span style="font-size: 36px;">${ random }</strong></em></span></div></span></div></td></tr><tr><td style='font-size:1px; height:10px' height='10'></td></tr></table></th></tr></tbody></table></th></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr><tr style='padding:0;vertical-align:top'><td dir='auto' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:inherit;font-family:inherit;font-size:1px;font-weight:normal;hyphens:auto;line-height:0;margin:0;padding:0;vertical-align:top;word-wrap:break-word'><![endif]--><table class='row' border='0' cellpadding='0' cellspacing='0' style='border-collapse:collapse; background-color:transparent; mso-table-lspace:0pt; mso-table-lspace:0pt; mso-table-rspace:0pt;border-spacing:0;display:table;padding:0;position:relative;vertical-align:top;width:100%;margin:0;'><tbody><tr style='padding:0;vertical-align:top' valign='top'><th dir='auto' class='small-12 large-12 columns first last' style='Margin:0 auto;margin:0 auto;padding:0;padding-bottom:15px;padding-top:15px;padding-left:6px;padding-right:6px;width:564px' valign='top'><table style='border-collapse:collapse;border-spacing:0;padding:0;vertical-align:top;width:100%'><tbody><tr style='padding:0;vertical-align:top'><th dir='auto' align='center' style='padding:0;background-color:transparent;Margin:0;color:inherit;font-family:helvetica,arial,verdana,sans-serif;font-size:17px;font-weight:normal;line-height:1.5;margin:0;text-align:center;' valign='middle'>&#8203;<span style='display:inline-block;'>&nbsp;&nbsp;&nbsp;<a style='display:inline-block;text-decoration:none;' target='_blank' href='https://www.facebook.com/'><img class='sclbtn' style='vertical-align:middle;width:25px;height:25px'src='https://pblc.it/i/50x50x9.c.i/82906/social_but/s1/facebook.png' width='25' height='25'></a>&nbsp;&nbsp;&nbsp;</span>&#8203;&#8203;<span style='display:inline-block;'>&nbsp;&nbsp;&nbsp;<a style='display:inline-block;text-decoration:none;' target='_blank' href='https://twitter.com/'><img class='sclbtn' style='vertical-align:middle;width:25px;height:25px'src='https://pblc.it/i/50x50x9.c.i/3c159/social_but/s1/twitter.png' width='25' height='25'></a>&nbsp;&nbsp;&nbsp;</span>&#8203;&#8203;<span style='display:inline-block;'>&nbsp;&nbsp;&nbsp;<a style='display:inline-block;text-decoration:none;' target='_blank' href='https://www.linkedin.com/'><img class='sclbtn' style='vertical-align:middle;width:25px;height:25px'src='https://pblc.it/i/50x50x9.c.i/c4442/social_but/s1/linkedin.png' width='25' height='25'></a>&nbsp;&nbsp;&nbsp;</span>&#8203;</th></tr></tbody></table></th></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr><tr style='padding:0;vertical-align:top'><td dir='auto' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:inherit;font-family:inherit;font-size:1px;font-weight:normal;hyphens:auto;line-height:0;margin:0;padding:0;vertical-align:top;word-wrap:break-word'><![endif]--><table class='row' border='0' cellpadding='0' cellspacing='0' style='border-collapse:collapse; background-color:transparent; mso-table-lspace:0pt; mso-table-lspace:0pt; mso-table-rspace:0pt;border-spacing:0;display:table;padding:0;position:relative;vertical-align:top;width:100%;margin:0;'><tbody><tr style='padding:0;vertical-align:top' valign='top'><th dir='auto' class='small-12 large-12 columns first last' style='Margin:0 auto;margin:0 auto;padding:0;width:640px' valign='top'><table style='border-collapse:collapse;border-spacing:0;padding:0;vertical-align:top;width:100%'><tbody><tr style='padding:0;vertical-align:top'><th dir='auto' align='left' style='padding:0;background-color:transparent;Margin:0;color:inherit;font-family:helvetica,arial,verdana,sans-serif;font-size:17px;font-weight:normal;line-height:1.5;margin:0;'><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;margin:0;mso-line-height-rule:exactly;padding:0;vertical-align:top;'>&nbsp;</td></tr></tbody></table><p align='center' style='text-align: center'><a target='_blank' style='text-decoration:none!important;outline:0!important;border:none!important;' href='https://publicate.it/?e=96046'><img width='150' height='21' style='border:none; outline:0; width:150px; margin:0 auto; vertical-align:middle!important;' alt='created in Publicate' src='https://publicate.it/imgs/created_in_publicate.gif' /></a></p><table class='spacer' style='border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%'><tbody><tr style='padding:0;text-align:left;vertical-align:top'><td height='16' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;margin:0;mso-line-height-rule:exactly;padding:0;vertical-align:top;'>&nbsp;</td></tr></tbody></table></th></tr></tbody></table></th></tr></tbody></table><!--[if (gte mso 9)|(IE)]></td></tr><tr style='padding:0;vertical-align:top'><td dir='auto' style='-moz-hyphens:auto;-webkit-hyphens:auto;Margin:0;border-collapse:collapse!important;color:inherit;font-family:inherit;font-size:1px;font-weight:normal;hyphens:auto;line-height:0;margin:0;padding:0;vertical-align:top;word-wrap:break-word'><![endif]--></td></tr></tbody></table></td></tr></tbody></table><img src='https://publicate.it/open/email/96046/pic.gif?1562903159' width='1' height='1' style='width:1px;height:1px;max-width:1px !important; max-height:1px !important; width:1px !important; height:1px !important;' /></body></html>`
  }

  conn.query(sql, (err, rows) =>{
      if (err) {
            res.status(400).json({
                message:err
            })
      }else{
          let email = ''
          let id = ''
          let data = rows
          data.map((item) =>{
              email = item.email
              id = item.id_guide
          })
          console.log(id)
          if (checkEmail === email) {
              transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                    res.status(400).json({
                        message:error
                    })
                  } else {
                      
                      console.log('Email sent: ' + info.response);
                      res.send({
                          kode: random,
                          id: id
                      })
                  }
              });
          }else{
            res.status(400).json({
                message:'email wrong'
            })
          } 
      }
  })
}

exports.changePwd = (req,res) =>{
  let id = req.params.id
  let {email, password, newPassword} = req.body
  if( password === newPassword){
      let encryptPassword = bcrypt.hashSync(password, salt);
      let sql = `update tb_guide set password = '${encryptPassword}' where id_guide = ${id}` 
      conn.query(sql, (err, rows)=>{
          if (err) {
                res.status(400).json({
                    message:err
                })
          }else{
              res.send({
                  message: 'Change password sukses'
              })
          }
      })
  }else{
    res.status(400).json({
        message:'password not same'
    })
  }

}