const express = require('express');
const routes = require('express').Router();
const DB = require('./db');


routes.get('/filters', function(req, res) {
    DB.getFilters().then((filters) =>  {
        res.status(200).json(filters)
    }).catch((err) => {
        console.log('Error getting filters: ', err);
        res.status(500).json({ error: 'Internal server error' });
    })
});

module.exports = routes;

