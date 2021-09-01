const exprees = require('express');
const app = exprees();

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');
const bodyParser = require('body-parser');

app.use('/uploads', exprees.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
         'Origin, X-Requrested-With, Content-Type, Accept, Authotization'
         
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }
    next();
})

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

app.use((req, res, next) => {
    const erro = new Error ('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((errror, req, res, next ) =>{
    res.status(errror.status || 500)
    return res.send({
        erro: {
            mensagem: errror.message
        }
    })
});

module.exports = app;