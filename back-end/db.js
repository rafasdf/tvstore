const mysql = require('mysql');
const config = require('./config');

class DB {
    // static con;

    static getFilters() {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let filters = {};

                let sql = "SELECT DISTINCT brand FROM item";
                connection.query(sql, function (err, result) {
                    if (err) reject(err);
                    filters.brand = result.map((item) => item.brand);
                    resolve(filters);
                });
            });
        });

    }
}

if (!DB.pool) DB.pool = mysql.createPool(config);


module.exports = DB;