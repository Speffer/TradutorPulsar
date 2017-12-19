const mysql = require('mysql');

const config = require('../config.js');
const loginDB = config.connect_db;


const connection = mysql.createConnection(loginDB);

let executeSQL = function(querySQL) {

    return new Promise(
        function(resolve, reject){
            connection.query(querySQL, (error, results, fields) => {
                if(error) {
                    reject(error);
                }
        
                resolve(id = results);
                
            });
            
    }); 
    connection.end();
} 


module.exports = {
    executeSQL
};

// executeSQL('SELECT id_new FROM Produtos.Produtos WHERE id_old').then((teste) => {
//     console.log(teste)
// }).catch((e) => {
//     console.log(e)
// })
