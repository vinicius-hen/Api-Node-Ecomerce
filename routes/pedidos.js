const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;



router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            `SELECT p.id_pedidos,
            p.quantidade,
            p2.id_produto,
            p2.nome,
            p2.preco 	   
        FROM pedidos p 
    INNER JOIN produtos p2 
        ON p2.id_produto = p.id_produto ;`,
            (error, result, field) => {
                conn.release();
                if(error){
                  return res.status(500).send({
                       error: error,
                       response:  null
                   }); 
                } 
                const response = {
                    pedidos: result.map(pedido=> {
                        return{
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,
                            produto:{
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna um pedido especifico',
                                url: 'http://localhost:3000/produtos/' + pedido.id_produto

                            }
                        }
                    })
                }
                res.status(201).send(response);
            }
        )
    });
});

router.post('/',(req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_produto = ? ' ,
             [req.body.id_produto], 
             (error, result, field) => {
                if(error){return res.status(500).send({error: error})}
                if(result.lenght==0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com esse Id'
                    })
                }
     
        conn.query(
            'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
            [req.body.id_produto, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if(error){
                  return res.status(500).send({
                       error: error,
                       response:  null
                   }); 
                }
                const response = {
                    mensagem: 'Pedido Inserido com sucesso',
                    pedidoCriado: { 
                        id_pedido:result.id_pedido,
                        id_produto:req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                             tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                             url: 'http://localhost:3000/produtos/' 
                            }
                        }
                    }
                 return res.status(201).send(response)
                 }
            )
        })
    });
});


router.get('/:id_pedido', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                conn.release();
                if(error){
                  return res.status(500).send({
                       error: error,
                       response:  null
                   }); 
                } 
                if(result.lenght==0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado pedido com esse Id'
                    })
                }
                const response = {
                    pedido: { 
                        id_pedido:result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos/' 
                        }
                    }
                }
               return res.status(200).send(response)
            }
        )
    });
});

router.patch('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'OK, Altera um pedido'
    });
});


router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) =>{
        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM pedidos WHERE id_pedidos = ?;',
            [req.body.id_pedido],
            (error, resultado, field) => {
                conn.release();
                if(error){
                  return res.status(500).send({
                       error: error,
                       response:  null
                   }); 
                } 
                res.status(202).send({
                    mensagem: "Pedido deletado com sucesso com sucesso"
                });
            }
        )
    });
});




module.exports =  router;