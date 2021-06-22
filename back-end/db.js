const mysql = require('mysql');
const config = require('./config');
const knex = require('knex')({
    client: 'mysql',
    connection: config
  });

class DB {
    // static con;

    static getFilters() {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let filters = {};

                let sql_brand = "SELECT DISTINCT brand FROM item";
                let sql_type = "SELECT DISTINCT screen_type FROM item";
                let sql_size = "SELECT DISTINCT screen_size FROM item";
                let sql_resolution = "SELECT DISTINCT resolution FROM item";
                let sql_voltage = "SELECT DISTINCT voltage FROM item";
                connection.query(sql_brand, function (err, result) {
                    if (err) reject(err);
                    filters.brand = result.map((item) => item.brand); 
                    connection.query(sql_type, function (err, result) {
                        if (err) reject(err);
                        filters.screen_type = result.map((item) => item.screen_type);
                        connection.query(sql_size, function (err, result) {
                            if (err) reject(err);
                            filters.screen_size = result.map((item) => item.screen_size);
                            connection.query(sql_resolution, function (err, result) {
                                if (err) reject(err);
                                filters.resolution = result.map((item) => item.resolution);
                                connection.query(sql_voltage, function (err, result) {
                                    if (err) reject(err);
                                    filters.voltage = result.map((item) => item.voltage);
                                    resolve(filters);
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    static getItems() {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let sql = "SELECT * FROM item";
                connection.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

    static countItems() {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let sql = "SELECT COUNT(1) AS quant FROM item";
                connection.query(sql, function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

    static getPageItems(ini,limit) {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let sql = "SELECT * FROM item LIMIT ?,?";
                connection.query(sql, [ini,limit], function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

    static getPageItems2(ini,limit,where) {

        return new Promise((resolve, reject) => {

            const items = knex.from('item').select("*").where((qb) => {
                if(where.brand !== undefined)
                    qb.whereIn('brand', where.brand);
                if(where.type !== undefined) 
                    qb.whereIn("screen_type", where.type);
                if(where.size !== undefined) 
                    qb.whereIn("screen_size", where.size);
                if(where.resolution !== undefined)
                    qb.whereIn("resolution", where.resolution); 
                if(where.voltage !== undefined) 
                    qb.whereIn("voltage", where.voltage);
                if(where.search !== undefined)
                    qb.where("title", "LIKE", where.search);
              }).limit(limit).offset(ini);
            
            items.then((rows) => {resolve(rows);})
            .catch((err) => { console.log( err); reject(err) });

        });
    }

    static getItemsMeta(id) {
        return new Promise((resolve, reject) => {
            DB.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                let sql_meta = "SELECT * FROM item_meta WHERE id = ?";
                connection.query(sql_meta,[id], function (err, result) {
                    if (err) reject(err);
                    resolve(result);
                });
            });
        });
    }

}

if (!DB.pool) DB.pool = mysql.createPool(config);

module.exports = DB;