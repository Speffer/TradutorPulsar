const request = require('request');

const db = require('../database/execute_db.js');
const API = require('./auxiliarAPI.js');
const config = require('../config.js');

var urlAPI = config.url;
var header = config.headers;

let inserirCliente = (cliente, auth) => {

    return new Promise(
            function (resolve, reject){  
                
                API.getToken(auth).then((token) => {

                    getIBGE_code(cliente.endereco_municipio, auth).then((ibge_code_final) => {

                        let cliente_novo = {
                            cliente: {
                               nome: cliente.nome,
                                nome_fantasia: cliente.nome,
                                data_nascimento: cliente.data_nascimento,
                               email: cliente.email,
                               documento: cliente.documento,
                               telefone: cliente.telefone,
                               celular: cliente.celular
                            }, 
                            endereco: {
                               cep: cliente.endereco_cep,
                               endereco: cliente.endereco_logradouro,
                               nro: cliente.endereco_numero,
                               bairro: cliente.endereco_bairro
                            }, 
                            ibge_code: ibge_code_final
    
                        };
    
                        let options = { 
                            method: 'POST',
                            url: ''+urlAPI+'/api/cliente?token='+token+'',
                            headers: header,
                            form: cliente_novo
                        };
    
                        request(options, (error, response, body) => {
    
                            bodyparse = JSON.parse(body);
                            console.log(response.statusCode);
                            console.log(bodyparse);
                        
                            if(response.statusCode == 201) {
                                console.log(bodyparse);
                                let codigo = bodyparse.codigo;
                                let temp = {
                                    codigo,
                                    'status': response.statusCode
                                };
                                resolve(temp);
                            } else if (error == null) {
                                let fail = bodyparse;
                                reject(fail);
                            } else {
                                reject('Erro:', error);
                            }
                        });

                    }).catch((err) => {
                    reject(err);
                });

                    
                }).catch((err) => {
                    reject(err);
                });
        });
 };


let updateCliente = (cliente, auth) => {

    return new Promise(
            function(resolve, reject) {

                if(!cliente.codigo) {
                    reject('Código do produto não recebido')
                }

                API.getToken(auth).then((token) => {

                    var sql = 'SELECT id_cliente_new FROM Clientes WHERE id_cliente_old = '+cliente.codigo+'';

                    db.executeSQL(sql).then((id) => {
                        id_new = id[0].id_cliente_new

                        cliente_put = {
                            cliente: {
                                nome: cliente.nome,
                                email: cliente.email,
                                documento: cliente.documento,
                                telefone: cliente.telefone,
                                celular: cliente.celular
                            },
                            endereco: {
                                cep: cliente.endereco_cep,
                                endereco: cliente.endereco_logradouro,
                                nro: cliente.endereco_numero,
                                bairro: cliente.endereco_bairro
                            },
                            cliente_id: id_new,
                            ibge_code: ibge_code_final
                        }

                        let options = { 
                            method: 'PUT',
                            url: ''+urlAPI+'/api/cliente?token='+token+'',
                            headers: header,
                            form: cliente_put
                        };

                        request(options,(error, response, body) => {
                            
                            bodyparse = JSON.parse(body);
                            console.log(response.statusCode)
                            console.log(bodyparse)
    
                            if(response.statusCode == 200) {
                                let temp = {
                                    'status' : response.statusCode  
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
                        reject(err);
                    });


                }).catch((err) => {
                    reject(err);
                });
        });
}

let getIBGE_code = (municipio, auth) => {
    console.log(municipio)
    return new Promise(
        function(resolve, reject) {
            console.log(auth)
            API.getToken(auth).then((token) => {

                var options = { 
                    method: 'GET',
                    url:''+urlAPI+'/api/utilitarios/consultacidades?token='+token+'&nome_cidade='+municipio+'',
                    headers: header
                
                };

                request(options,(error, response, body) => {

                    console.log(body)
                    bodyparse = JSON.parse(body);
                    resolve(ibge_code_final = bodyparse[0].cidade_ibge_code); 
                    
                    if(error) {
                        reject(error);
                    }
                });

            }).catch((err) => {
                reject(err)
            });
        });
}

module.exports = {
    inserirCliente,
    updateCliente
}