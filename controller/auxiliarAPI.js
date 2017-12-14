const request = require('request');

const config = require('../config.js');

var urlAPI = config.url;
var header = config.headers;

function getToken() {

    return new Promise(
        function(resolve, reject) {

            let options = { 
                method: 'POST',
                url: `${urlAPI}/api/usuario/login`,
                headers: header,
                form: {
                    email: 'teste@bmsoftware.org', 
                    password: '12345'
                }
            };
    
            request(options, (error, response, body) => {
                bodyparse = JSON.parse(body);
                resolve(token = bodyparse.token);
            });  
        }
    );
};

function getCarteiraPadrao() {
    return new Promise(
        function(resolve, reject) {

            let login = getToken().then((token) => {
                
                var options = { 
                    method: 'GET',
                    url: `${urlAPI}/api/carteira/carteirapadrao?token=${token}`,
                    headers: header,
                    form: { } 
                };
    
                request(options,(error, response, body) => {
                    bodyparse = JSON.parse(body);
                    resolve(carteira = bodyparse.id); 
                });
            }).catch((err) => {
                console.log('Erro: ', err)
            });
        }
    );
};

module.exports = {
    getToken,
    getCarteiraPadrao
};