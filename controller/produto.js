const request = require('request');

const db = require('../database/execute_db.js');
const API = require('./auxiliarAPI.js');
const config = require('../config.js');

var urlAPI = config.url;
var header = config.headers;

let inserirProduto = (produto) => {

    return new Promise(
        function (resolve, reject){  

            API.getToken().then((token) => {
                
                API.getCarteiraPadrao().then((carteira) => {

                    produto.carteira = carteira;
                    produto.assinatura = 0;
                    //console.log(produto)

                    let options = { 
                        method: 'POST',
                        url: `${urlAPI}/api/produto?token=${token}`,
                        headers: header,
                        form: produto
                    };

                    request(options, (error, response, body) => {

                        bodyparse = JSON.parse(body);
                        console.log(response.statusCode)
                        console.log(bodyparse)
                        if(response.statusCode == 201) {
                            let codigo = bodyparse.codigo;
                            let temp = {
                                codigo,
                                'status' : response.statusCode
                            };
                            resolve(temp);
                        } else if (error == null) {
                            let fail = bodyparse
                            reject(fail)
                        } else {
                            reject(error)
                        }
                    })
                }).catch((err) => {
                    console.log('Erro: ', err)
                });
            }).catch((err) => {
                console.log('Erro: ', err)
            });
    });
};


let updateProduto = (produto) => {

    return new Promise(
        function (resolve, reject){

            if(!produto.codigo_produto) {
                reject('Código do produto não recebido')
            } 
        
            API.getToken().then((token) => {

                API.getCarteiraPadrao().then((carteira) => {

                    var sql = `SELECT id_new FROM Produtos.Produtos WHERE id_old = ${produto.codigo_produto}`;
                    
                    db.executeSQL(sql).then((id) => {

                        produto.carteira = carteira;
                        id_new = id[0].id_new; 
        
                        let options = { 
                            method: 'PUT',
                            url: `${urlAPI}/api/produto/${id_new}?token=${token}`,
                            headers: header,
                            form: produto
                        };
        
                        request(options,(error, response, body) => {

                            bodyparse = JSON.parse(body);
                            console.log(response.statusCode)
                            console.log(bodyparse)

                            if(response.statusCode == 200) {
                                let temp = {
                                    produtos_novo: {
                                        'descricao' : produto.descricao,
                                        'valor' : produto.valor
                                    },
                                    'status' : response.statusCode,
                                
                                };
                                resolve(temp);
                            } else if (error == null) {
                                let fail = bodyparse
                                reject(fail)
                            } else {
                                reject(error)
                            }
                        });

                    }).catch((err) => {
                        console.log('Erro: ', err)
                    });
                
                }).catch((err) => {
                    console.log('Erro: ', err)
                });

            }).catch((err) => {
                console.log('Erro: ', err) 
            });

    });

};

module.exports = {
    inserirProduto,
    updateProduto
}