const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');

router.post('/cadastro', (req, res, next ) => {
    mysql.getConnection((err, conn) =>{
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error,results) => {
            if(error){return res.status(500).send({error: error})}
            if(results.length >0){
                res.status(409).send({mensagem:"Usuario já cadastrado"})
            }else{
                bcrypt.hash(req.body.senha, 10, (errBcript, hash) => {
                    if(errBcript){ return res.status(500).send({error: errBcript})}
                    conn.query(
                        `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
                     [req.body.email, hash],
                     (error, results) => {
                         conn.release();
                         if(error){ return res.status(500).send({ error: error})}
                         
                            response = {
                                 mensagem: 'Usuario criado com sucesso',
                             usuarioCriado: {
                                 id_usuario: results.insertId,
                                 email: req.body.email
                                }
                            }
                            return res.status(201).send(response);
                     })
                });
            }
         })
     
    });
});



module.exports = router;