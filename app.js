const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
// db import 
require('./config/db.config')

const app = express()

const PORT = process.env.PORT || 3000

// routes version 1.0.0 (auth) 
const authRoutes = require('./routes/v1/auth.route');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())   // cookie parser
app.use(cors())           // enable CORS

app.use(morgan('dev'))

// to remove CORS error
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // * means all
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE'); // methods allowed
    res.setHeader('Access-Control-Allow-Headers', '*'); // * means all allowed headers (Authorization, Content-Type)
    next();
});

// routes
app.get('/', (req, res) => {
    res.status(200).send('Welcome to the API');
});

app.use('/api/v1', authRoutes)


// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}.`)
})


module.exports = app;