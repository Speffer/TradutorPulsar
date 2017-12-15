const clientes = require('../controller/cliente.js');

module.exports = app => {
    
    app.post('/api/clientes/insert', (req, res) => {

        let novo_cliente = clientes.inserirCliente(req.body, req.headers.authorization); 
        
        novo_cliente.then((ret) => {
            res.send(ret);
        }).catch((err) => {
            console.log('Erro', err);
            res.status('500').send(err);
        });
        
    });

    app.put('/api/clientes/update', (req, res) => {

        let cliente_atualizado = clientes.updateCliente(req.body, req.headers.authorization);
        
        cliente_atualizado.then((ret) => {
            res.send(ret);
        }).catch((err) => {
            console.log('Erro', err);
            res.status('500').send(err);
        });
    });
};