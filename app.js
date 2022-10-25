const express = require('express');
const path = require('path');
const hbs = require('hbs')
const bodyParser = require('body-parser');
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config({path: './config/.env'})


require('./database/Connection');
const router = require('./routes/user')

const port = process.env.PORT

const viewPath = path.join(__dirname, '../MysqluaerModule/views');
const headerPath = path.join(__dirname, '../MysqluaerModule/views/partials');

app.set('view engine', 'hbs')
app.set('views', viewPath);
hbs.registerPartials(headerPath);

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(viewPath))

//ROUTES REALTED CODE
app.use(router);


app.listen(port, () => {
    console.log('server is up on port ' + port);
})




