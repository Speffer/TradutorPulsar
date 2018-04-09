const request = require('request');

const config = require('../config.js');
const db = require('../database/execute_db.js');

var urlAPI = config.url;
var header = config.headers; 

let getToken = (auth) => {

    return new Promise( 
        function(resolve, reject) {
            
            getEmail(auth).then((auth_final) => {

                let options = { 
                    method: 'POST',
                    url: ''+urlAPI+'/api/usuario/login',
                    headers: header,
                    form: auth_final
                };
        
                request(options, (error, response, body) => {
                    bodyparse = JSON.parse(body);
                    console.log('token:', bodyparse.token);
                    resolve(bodyparse.token);
                });
            }).catch((err) => {
                reject(err);
            });
         
        }
    );
};

let getEmail = (auth) => {

    return new Promise(
        function(resolve, reject) {

            let comtoken = auth.split(' ');
            let tokenstr = comtoken[1].split(':'); 
            let token = tokenstr[0];
            let senha = tokenstr[1].split(':');
            
            if((!token)||(!senha)) {
                reject('Token ou senha inválidos.')
            }

            var sql = 'SELECT email FROM Users WHERE token = \''+token+'\'';

            db.executeSQL(sql).then((emailReq) => {

                let emailOk = emailReq[0].email;

                let auth_final = {
                    password: senha[0],
                    email: emailOk
                };
    
                resolve(auth_final);
            }).catch((err) => {
                reject(err);
            });
    });    
    
}

module.exports = {
    getToken,
    getEmail
};