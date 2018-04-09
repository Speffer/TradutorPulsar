const produtos = require('../controller/produto.js');

module.exports = app => {
    
    app.put('/api/produtos/update', (req, res) => {
        
        let produto_atualizado = produtos.updateProduto(req.body, req.headers.authorization);
        
        produto_atualizado.then((ret) => {
            res.send(ret);
        }).catch((err) => {
            res.status('500').send(err);
        });
        
    });

    app.post('/api/produtos/insert', (req, res) => {

        let novo_produto = produtos.inserirProduto(req.body, req.headers.authorization);
        
        novo_produto.then((ret) => {
            res.send(ret);
        }).catch((err) => {
            res.status('500').send(err);
        });
    });
};