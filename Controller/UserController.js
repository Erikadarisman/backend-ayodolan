"use strict";
const isempty = require("lodash.isempty");
const conn = require("../Connection/connect");
const response = require("../response/response");

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(7);

const dataEmpty = () => {
  res.status(400).send({
    message: "Data can't be empty"
  });
};

exports.showAll = (req, res) => {
  conn.query("select * from tb_user", (error, rows) => {
    if (error) {
      console.log(error);
    } else {
      response.fulfield(rows, res);
    }
  });
};

exports.update = (req, res) => {
  let id = req.params.id;
  let gender = req.body.gender;
  let no_phone = req.body.no_phone;
  let image = req.body.image;
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

exports.register = (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let gender = req.body.gender;
  let no_phone = req.body.no_phone;
  let image = req.body.image;
  if (!username && !email && !password && !gender && !no_phone) {
    res.status(400).send({
      message: "Data can't be empty"
    });
  } else {
    conn.query(
      `select * from tb_user where email='${email}'`,
      (error, rows) => {
        if (rows.length > 0) {
          res.send({
            message: "Email has been used"
          });
        } else {
          conn.query(
            `select * from tb_user where username='${username}'`,
            (error, rows) => {
              if (rows.length > 0) {
                res.send({
                  message: "Username has been used"
                });
              } else {
                let encryptPassword = bcrypt.hashSync(password, salt);
                conn.query(
                  "insert into tb_user set username=?, email=?, password=?, gender=?, no_phone=?, image=?",
                  [username, email, encryptPassword, gender, no_phone, image],
                  (error, rows) => {
                    if (error) {
                      console.log("error 1");
                    } else {
                      conn.query(
                        "select * from tb_user order by user_id desc limit 1",
                        (error, row) => {
                          if (error) {
                            console.log("error 2");
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
        console.log(error);
      } else {
        res.send({
          message: "Data Has Been Delete"
        });
      }
    });
  }
};
