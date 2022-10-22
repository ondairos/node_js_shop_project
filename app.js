const path = require('path');
const helper = require('./helper'); //helper js file

//env variables for secure mongoose connect
const usernamedb = process.env.DB_USERNAME;
const passdb = process.env.DB_PASSWORD;

//package includes
const express = require('express');  //framework
const bodyParser = require('body-parser'); //parser
const mongoose = require('mongoose'); //database ODM object document mapping library
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);  //Session with MongoDB

const errorController = require('./controllers/error'); //404 controller
const User = require('./models/user'); //user model

const MONGODB_URI = `mongodb+srv://${usernamedb}:${passdb}@cluster0.ga01wzx.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();  //main express init
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');  //EJS as the template engine
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));   //bodyparser config
app.use(express.static(path.join(__dirname, 'public'))); // path config with express
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);  //session middleware

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user; //mongoose model for user
      next();
    })
    .catch(err => {
      console.log(err);
    })
});

app.use('/admin', adminRoutes); //web app routes for admin
app.use(shopRoutes); //shop routes for users
app.use(authRoutes); //authentication routes

app.use(errorController.get404); //use of 404 controller

//mongoose init and app init
mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })