const request = require('request');

const API = require('./auxiliarAPI.js');
const config = require('../config.js');
const db = require('../database/execute_db.js');

var urlAPI = config.url;
var header = config.headers;

let inserirFatura = (fatura, auth) => {

    return new Promise(
        function(resolve, reject) {

            if((!fatura.cliente)||(!fatura.cliente.codigo)) {
                reject('Código do cliente não recebido')
            }

            API.getToken(auth).then((token) => {

                getHash(token, fatura.parcelas).then((hash) => {

                    var sql = 'SELECT id_cliente_new FROM Clientes WHERE id_cliente_old = '+fatura.cliente.codigo+'';

                    db.executeSQL(sql).then((id) => {

                        id_new = id[0].id_cliente_new;

                        var prodaux = [];
                        var countQtd = 0;
                        var cod_array = [];

                        for(let i of fatura.itens) {
                            cod_array.push(i.codigo_produto);

                            if(!fatura.itens[countQtd].codigo_produto && fatura.valor_total == null) {
                                reject('Código do produto do produto não recebido')
                            }

                            countQtd++;
                        }

                        var sql2 = 'SELECT id_produto_new FROM Produto WHERE id_produto_old IN ('+cod_array+')';

                        if (fatura.valor_total != null){
                            let fatura_nova = {
                                boleto: {
                                    vencimento: fatura.vencimento,
                                    cliente_id: id_new,
                                    desconto: fatura.itens.desconto
                                },
                                produto: prodaux,
                                carne: {
                                    parcelas: fatura.parcelas
                                },
                                valor_total: fatura.valor_total,
                                hash_boleto: hash
                            };

                            let options = {
                                method: 'POST',
                                url: ''+urlAPI+'/api/boleto?token='+token+'',
                                headers: header,
                                form: fatura_nova
                            };

                            request(options, (error, response, body) => {

                                bodyparse = JSON.parse(body);
                                console.log(response.statusCode);
                                console.log('aquii', bodyparse);

                                if(response.statusCode == 201 || response.statusCode == 200) {
                                    let temp = {
                                        'url' : bodyparse,
                                        'status' : response.statusCode
                                    };
                                    resolve(temp);
                                } else if (error == null) {
                                    let fail = bodyparse;
                                    reject(fail)
                                } else {
                                    reject(error)
                                }
                            })
                        } else{
                            db.executeSQL(sql2).then((array_produto) => {

                                let countProd = 0;

                                for(let i of array_produto) {

                                    id_new_produto = i.id_produto_new;
                                    prodaux.push({
                                        produto_id: id_new_produto,
                                        quantidade: fatura.itens[countProd].quantidade
                                    });

                                    countProd++
                                }

                                let fatura_nova = {
                                    boleto: {
                                        vencimento: fatura.vencimento,
                                        cliente_id: id_new,
                                        desconto: fatura.itens.desconto
                                    },
                                    produto: prodaux,
                                    carne: {
                                        parcelas: fatura.parcelas
                                    },
                                    valor_total: fatura.valor_total,
                                    hash_boleto: hash
                                };

                                let options = {
                                    method: 'POST',
                                    url: ''+urlAPI+'/api/boleto?token='+token+'',
                                    headers: header,
                                    form: fatura_nova
                                };

                                request(options, (error, response, body) => {

                                    bodyparse = JSON.parse(body);
                                    console.log(response.statusCode);
                                    console.log('aquii', bodyparse);

                                    if(response.statusCode == 201 || response.statusCode == 200) {
                                        let temp = {
                                            'url' : bodyparse,
                                            'status' : response.statusCode
                                        };
                                        resolve(temp);
                                    } else if (error == null) {
                                        let fail = bodyparse;
                                        reject(fail)
                                    } else {
                                        reject(error)
                                    }
                                })

                            }).catch((err) => {
                                reject(err);
                            });
                        }


                    }).catch((err) => {
                        reject(err);
                    });

                }).catch((err) => {
                    reject(err);
                });

            }).catch((err) => {
                reject(err);
            });

    });
}

let getHash = (token, quantidade) => {

    return new Promise(
        function(resolve, reject) {

            if(quantidade == null) {
                quantidade = 1;
            }

            let options = {
                headers: header,
                method: 'GET',
                url: ''+urlAPI+'/api/limite?token='+token+'&quantidade='+quantidade+''
            };

            request(options, (error, response, body) => {

                bodyparse = JSON.parse(body);
                console.log(response.statusCode);
                console.log('hash: ', bodyparse.hash_boleto);

                if(response.statusCode == 201 || response.statusCode == 200) {
                    resolve(bodyparse.hash_boleto);
                } else if (error == null) {
                    let fail = bodyparse;
                    reject(fail)
                } else {
                    reject(error)
                }
            })
        }
    );

}


module.exports = {
    inserirFatura
}