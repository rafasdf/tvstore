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
                
                let filters = {};
                knex.from("item").distinct("brand")
                .then((brands) => {
                    filters.brand = brands.map((item) => item.brand);
                    knex.from("item").distinct("screen_type")
                    .then((types) => {
                        filters.screen_type = types.map((item) => item.screen_type);
                        knex.from("item").distinct("screen_size")
                        .then((sizes) => {
                            filters.screen_size = sizes.map((item) => item.screen_size);
                            knex.from("item").distinct("resolution")
                            .then((resolutions) => {
                                filters.resolution = resolutions.map((item) => item.resolution);
                                knex.from("item").distinct("voltage")
                                .then((voltages) => {
                                    filters.voltage = voltages.map((item) => item.voltage);
                                    resolve(filters);
                                }).catch((err) => { console.log( err); reject(err) });
                            }).catch((err) => { console.log( err); reject(err) });
                        }).catch((err) => { console.log( err); reject(err) });
                    }).catch((err) => { console.log( err); reject(err) });
                }).catch((err) => { console.log( err); reject(err) });
                
        });
    }

    static getItems() {
        return new Promise((resolve, reject) => {
            const items = knex.from("item").select("*");
            items.then((rows) => {resolve(rows);})
            .catch((err) => { console.log( err); reject(err) });
        });
    }

    static countItems(where) {
        return new Promise((resolve, reject) => {
            const items = knex.from("item").count({ quant: 'id' }).where((qb) => {
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
                qb.whereRaw("LOWER(title) LIKE ?", where.search);
              });
            items.then((rows) => {resolve(rows);})
            .catch((err) => { console.log( err); reject(err) });
        });
    }

    static getPageItems(ini,limit,where) {

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
                    qb.whereRaw("LOWER(title) LIKE ?", where.search);
              }).limit(limit).offset(ini);
            
            items.then((rows) => {resolve(rows);})
            .catch((err) => { console.log( err); reject(err) });

        });
    }

    static getItemsMeta(id) {
        return new Promise((resolve, reject) => {
            const items = knex.from("item_meta").select("*").where("id","=",id);
            items.then((rows) => {resolve(rows);})
            .catch((err) => { console.log( err); reject(err) });
        });
    }

}

module.exports = DB;