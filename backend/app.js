// IMPORTS VARI NECESSARI PER FACILITARE IL LAVORO
const express = require('express')
const bodyParser = require('body-parser')

// Imports dei files locali con appositi metodi
const locationRoutes = require('./routes/location')

const app = express()

// MIDDLEWARE Functions
app.use(bodyParser.json())

// MIDDLEWARE DOVE VENGONO SETTATI GLI HEADER PER LE REST
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // Next per permettere ad express di passare al prossimo middleware
    next();
})

app.use(locationRoutes)


app.listen(3000)