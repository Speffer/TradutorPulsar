const request = require('request');

const config = require('../config.js');
const db = require('../database/execute_db.js');

var urlAPI = config.url;
var header = config.headers; 

function getToken(auth) {

    return new Promise( 
        function(resolve, reject) {

            let login = getEmail(auth).then((auth_final) => {

                let options = { 
                    method: 'POST',
                    url: `${urlAPI}/api/usuario/login`,
                    headers: header,
                    form: auth_final
                };
        
                request(options, (error, response, body) => {
                    bodyparse = JSON.parse(body);
                    resolve(token = bodyparse.token);
                }); 
            }).catch((err) => {
                console.log('Error: ', err);
            });
         
        }
    );
};

function getCarteiraPadrao() {
    return new Promise(
        function(resolve, reject) {

            let login = getToken(auth).then((token) => {
                
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


let getEmail = (auth) => {

    return new Promise(
        function(resolve, reject) {
            
            let comtoken = auth.split(' ');
            let tokenstr = comtoken[1].split(':'); 
            let token = tokenstr[0]
            let senha = tokenstr[1].split(':');

            var sql = `SELECT email FROM Produtos.Users WHERE token = '${token}'`;

            db.executeSQL(sql).then((emailReq) => {
                       
                let emailOk = emailReq[0].email; 
                
                let auth_final = {
                    password: senha[0],
                    email: emailOk
                }
    
                resolve(auth_final);
            }).catch((err) => {
                reject(err);
            });
    });    
    
}

module.exports = {
    getToken,
    getCarteiraPadrao,
    getEmail
};