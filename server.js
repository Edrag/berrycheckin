const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const express = require('express');

const apiRouter = require('./api/api');

const app = express();

const PORT = process.env.PORT || 4001;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

app.use(express.static('public'))
app.use('/',apiRouter);

app.use(errorHandler());

app.listen(PORT,()=>{console.log(`Server running on ${PORT}`)});

module.exports = app;