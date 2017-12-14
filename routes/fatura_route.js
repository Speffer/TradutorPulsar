const fatura = require('../controller/fatura.js');

module.exports = app => {
    
    app.post('/api/faturas/insert', (req, res) => {
        
        let gerar_fatura = fatura.inserirFatura(req.body);
        
        gerar_fatura.then((ret) => {
            res.send(ret);
        }).catch((err) => {
            console.log('entrou', err)
            res.status('500').send(err);
        });
        
    });
}; 