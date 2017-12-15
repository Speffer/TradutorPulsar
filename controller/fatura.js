const request = require('request');

const API = require('./auxiliarAPI.js');
const config = require('../config.js');

var urlAPI = config.url;
var header = config.headers;

let inserirFatura = (fatura) => {

    return new Promise(
        function(resolve, reject) {

            if((!fatura.cliente)||(!fatura.cliente.codigo)) {
                reject('Código do cliente não recebido')
            } 

            API.getToken(auth).then((token) => {

                console.log(fatura)

                let fatura_nova = {
                    boleto: {
                       vencimento: fatura.vencimento,
                       cliente_id: fatura.cliente.codigo,
                       desconto: fatura.itens.desconto
                    }, 
                    produto: {
                       produto_id: fatura.itens.codigo_produto,
                       quantidade: fatura.itens.quantidade
                    }, 
                    carne: {
                        parcelas: fatura.parcelas
                    },              
                    valor_total: fatura.valor_total
                }

                let options = { 
                    method: 'POST',
                    url: `${urlAPI}/api/boleto?token=${token}`,
                    headers: header,
                    form: fatura_nova
                };

                request(options, (error, response, body) => {
                    
                    bodyparse = JSON.parse(body);
                    console.log(response.statusCode)
                    console.log(bodyparse)

                    if(response.statusCode == 201 || response.statusCode == 200) {
                        let temp = {
                            'url' : bodyparse,
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
        
    });
}

module.exports = {
    inserirFatura
}