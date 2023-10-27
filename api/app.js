/* General imports */

require('dotenv').config();
const express = require("express");

const routes = require("./routes/routes");
const { default: mongoose } = require("mongoose");

const app = express();

/* config express - valid data for read */

app.use(express.json())

/* Credentials */

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const strConnectMongoDb = `mongodb+srv://${ dbUser }:${ dbPassword }@cluster0.lnvdde3.mongodb.net/financetrack?retryWrites=true&w=majority`;

/* Connection on DB Before access the aplication */

mongoose
    .connect(strConnectMongoDb)
    .then(() => {
            app.use('/api/auth', routes).listen(3000, () => {
                console.log('Running on http://localhost:3000/api/auth');
            })
        }            
    )
    .catch( error => console.log(error));

