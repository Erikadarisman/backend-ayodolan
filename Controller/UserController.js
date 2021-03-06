"use strict"

require("dotenv/config");
const isempty = require("lodash.isempty");
const conn = require("../Connection/connect");
const response = require("../response/response");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(7);
const cloudinary = require('cloudinary');


const dataEmpty = () => {
  res.status(400).send({
    message: "Data can't be empty"
  });
};

exports.showAll = (req, res) => {
  conn.query("select * from tb_user", (error, rows) => {
    if (error) {
      res.status(400).json({
        message:error
    })
    } else {
      response.fulfield(rows, res);
    }
  });
};

exports.showById = (req, res) => {
  let id = req.params.id;
  conn.query(`select * from tb_user where user_id = ${id}`, (error, rows) => {
    if (error) {
      res.status(400).json({
        message:error
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
      `update tb_user set gender=?, no_phone=?, image=? where user_id = ${id}`,
      [gender, no_phone, image],
      (error, rows) => {
        if (error) {
          console.log(error);
        } else {
          conn.query(
            `select * from tb_user where user_id = ${id}`,
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

exports.register = async (req, res) => {
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

  let image = await getUrl();
  let name = req.body.name;
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let gender = req.body.gender;
  let no_phone = req.body.no_phone;
  // let image = req.body.image;
  if (!name && !username && !email && !password && !gender && !no_phone) {
    res.status(400).send({
      message: "Data can't be empty"
    });
  } else {
    conn.query(
      `select * from tb_user where email='${email}'`,
      (error, rows) => {
        if (rows.length > 0) {
          res.status(400).json({
            message:'email has been taked'
          })
        } else {
          conn.query(
            `select * from tb_user where username='${username}'`,
            (error, rows) => {
              if (rows.length > 0) {
                res.status(400).json({
                  message:'username has been taked'
                })
              } else {
                let encryptPassword = bcrypt.hashSync(password, salt);
                conn.query(
                  "insert into tb_user set name=?, username=?, email=?, password=?, gender=?, no_phone=?, image=?",
                  [name, username, email, encryptPassword, gender, no_phone, image],
                  (error, rows) => {
                    if (error) {
                      res.status(400).json({
                        message:error
                      })
                    } else {
                      conn.query(
                        "select * from tb_user order by user_id desc limit 1",
                        (error, row) => {
                          if (error) {
                            res.status(400).json({
                              message:error
                           })
                          } else {
                            res.send({
                              status: 200,
                              data: row
                            });
                          }
                        }
                      );
                    }
                  }
                );
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
    conn.query(`delete from tb_user where user_id = ${id}`, (error, rows) => {
      if (error) {
        res.status(400).json({
          message:error
       })
      } else {
        res.send({
          message: "Data Has Been Delete"
        });
      }
    });
  }
};
