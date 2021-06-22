const express = require('express');
const routes = require('express').Router();
const DB = require('./db');
const fs = require('fs');
const { stringify } = require('querystring');

routes.use(express.json());

routes.get('/filters', function(req, res) {
    DB.getFilters().then((filters) =>  {
        res.status(200).json(filters)
    }).catch((err) => {
        console.log('Error getting filters: ', err);
        res.status(500).json({ error: 'Internal server error' });
    })
});

routes.get('/items', function(req, res) {
    DB.getItems().then((items) =>  {
        res.status(200).json(items.map(addImage))
    }).catch((err) => {
        console.log('Error getting items: ', err);
        res.status(500).json({ error: 'Internal server error' });
    })
});

routes.get('/pageItems/:limit/:page', function(req, res) {
    let limit = parseInt(req.params.limit);
    let ini = (req.params.page-1)*limit;

    getPageItems(ini,limit).then((items) =>  {
        console.log(items);
        res.status(200).json(items)
    }).catch((err) => {
        console.log('Error getting items: ', err);
        res.status(500).json({ error: 'Internal server error' });
    });
    
});

routes.post('/pageItems2', function(req, res) {


    if(req.body.limit === undefined || req.body.ini === undefined)
        res.status(500).json({ error: 'Missing limits' });
    
    let limit = parseInt(req.body.limit);
    let ini = (req.body.ini-1)*limit;
    let where = {};

    if(req.body.search !== undefined) 
        where.search = "%"+req.body.search+"%";
    if(req.body.brand !== undefined && req.body.brand.length > 0) 
        where.brand = req.body.brand;
    if(req.body.type !== undefined && req.body.type.length > 0) 
        where.type = req.body.type;
    if(req.body.size !== undefined && req.body.size.length > 0) 
        where.size = req.body.size;
    if(req.body.resolution !== undefined && req.body.resolution.length > 0) 
        where.resolution = req.body.resolution;
    if(req.body.voltage !== undefined && req.body.voltage.length > 0) 
        where.voltage = req.body.voltage;

    getPageItems2(ini,limit,where).then((items) =>  {
        res.status(200).json(items)
    }).catch((err) => {
        console.log('Error getting items: ', err);
        res.status(500).json({ error: 'Internal server error' });
    });
    
});

async function getPageItems(ini,limit) {
    let myPromise = new Promise(function(myResolve, myReject) {
        DB.countItems().then((quant) =>  {
            myResolve(JSON.parse(JSON.stringify(quant)))
        }).catch((err) => {
            console.log('Error getting items: ', err);
            myReject({ error: 'Internal server error' });
        })
    });
    let quant = await myPromise;

    let myPromise2 = new Promise(function(myResolve, myReject) {
        DB.getPageItems(ini,limit).then((items) => {
            myResolve(JSON.parse(JSON.stringify((items.map(addImage)))));
        }).catch((err) => {
            console.log('Error getting items: ', err);
            myReject({ error: 'Internal server error' });
        })
    });
    let json_result = await myPromise2;

    return JSON.parse(JSON.stringify({items:json_result,size:quant[0].quant}));

}

async function getPageItems2(ini,limit,where) {
    let myPromise = new Promise(function(myResolve, myReject) {
        DB.countItems().then((quant) =>  {
            myResolve(JSON.parse(JSON.stringify(quant)))
        }).catch((err) => {
            console.log('Error getting items: ', err);
            myReject({ error: 'Internal server error' });
        })
    });
    let quant = await myPromise;

    let myPromise2 = new Promise(function(myResolve, myReject) {
        DB.getPageItems2(ini,limit,where).then((items) => {
            myResolve(JSON.parse(JSON.stringify((items.map(addImage)))));
        }).catch((err) => {
            console.log('Error getting items: ', err);
            myReject({ error: 'Internal server error' });
        })
    });
    let json_result = await myPromise2;

    return JSON.parse(JSON.stringify({items:json_result,size:quant[0].quant}));

}

routes.get('/itemsMeta/:id', function(req, res) {
    DB.getItemsMeta(req.params.id).then((items) =>  {
        let string = "{";
        let promise = new Promise((resolve, reject) => {
            items.forEach((item, index, array) => {
                string = string + "\"" + item.key.toLowerCase() + "\": \"" +item.value + "\"";
                if (index === array.length -1) {
                    string = string + "}";
                    resolve(JSON.parse(string));
                }
                else string = string + ",";
            });
        });
        promise.then((jsonItems) => {
            res.status(200).json(jsonItems);
        });
    }).catch((err) => {
        console.log('Error getting items: ', err);
        res.status(500).json({ error: 'Internal server error' });
    })
});

routes.get('/itemsWithMetas', function(req, res) {
    getItemsWithMetas().then((items) =>  {
        res.status(200).json(items)
    }).catch((err) => {
        console.log('Error getting items: ', err);
        res.status(500).json({ error: 'Internal server error' });
    })
});

function addImage(item) {

    let path = 'images/'+item.brand.toLowerCase()+'-tv.png';
    if (fs.existsSync('public/'+path)) {
        item.image_path = path;
    }
    return item;

}

async function getItemsWithMetas() {

    let myPromise = new Promise(function(myResolve, myReject) {

        DB.getItems().then((items) =>  {
            myResolve(JSON.parse(JSON.stringify(items.map(addImage))))
        }).catch((err) => {
            console.log('Error getting items: ', err);
            myReject({error: 'Internal server error' });
        })

    });

    let items = await myPromise;

    let myPromiseMeta = [];

    for (let i = 0; i < items.length; i++) { 

        myPromiseMeta[i] = new Promise(function(myResolve, myReject) {

            DB.getItemsMeta(items[i].id).then((itemsMeta) =>  {
                let string = "{";
                let promise = new Promise((resolve, reject) => {
                    itemsMeta.forEach((meta, index, array) => {
                        string = string + "\"" + meta.key.toLowerCase() + "\": \"" +meta.value + "\"";
                        if (index === array.length -1) {
                            string = string + "}";
                            resolve(JSON.parse(string));
                        }
                        else string = string + ",";
                    });
                });
                promise.then((jsonItems) => {
                    items[i].meta = jsonItems;
                });
            }).catch((err) => {
                console.log('Error getting items: ', err);
                myReject({ error: 'Internal server error' });
            })

        });
    }

    await Promise.all(myPromiseMeta).then((itemsWithMeta) =>  {
        console.log("itemsWithMeta: "+itemsWithMeta);
        return itemsWithMeta;
    }).catch((err) => {
        console.log('Error getting items: ', err);
        return { error: 'Internal server error' };
    });
    
}


module.exports = routes;

