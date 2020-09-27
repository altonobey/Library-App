const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const tableDataRoutes = require('./api/routes/tableData');

//password switch to process.env.MONGO_ATLAS_PW
mongoose.connect('mongodb+srv://admine:Password123@libraryappdatabase-vniwf.mongodb.net/Capstone?retryWrites=true',
{ useNewUrlParser: true }).then(() => {
    
  })
  .catch((err) => {
    console.log('Error on start: ' + err.stack);
    process.exit(1);
  });
console.log('running');
app.use(morgan('dev'));
app.use('/tables', express.static('tables'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//prevent CORS errors and handles errors currently allows all webpages to access api
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Aßuthorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//routes to handle requests
app.use('/tableData', tableDataRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log('help');
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;