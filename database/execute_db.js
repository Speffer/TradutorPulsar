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


