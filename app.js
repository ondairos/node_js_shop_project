const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
<<<<<<< HEAD
const mongoConnect = require('./util/database').mongoConnect;
<<<<<<< HEAD
const User = require('./models/user');
=======

>>>>>>> parent of 84c6916... added mongo database connection
=======
>>>>>>> parent of 9c873b0... added user functionality

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//retrieve user for incoming requests
app.use((req, res, next ) => {
    // User.findByPk(1)
    // .then(user => {
    //     req.user = user;
    //     next();
    // })
    // .catch(err => console.log(err));
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);




