const path = require('path');
const helper = require('./helper'); //helper js file

//env variables for secure mongoose connect
const usernamedb = process.env.DB_USERNAME;
const passdb = process.env.DB_PASSWORD;

//package includes
const express = require('express');  //framework
const bodyParser = require('body-parser'); //parser
const mongoose = require('mongoose'); //database ODM object document mapping library

const errorController = require('./controllers/error'); //404 controller
const User = require('./models/user'); //user model
 
const app = express();  //main express init

app.set('view engine', 'ejs');  //EJS as the template engine
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));   //bodyparser config
app.use(express.static(path.join(__dirname, 'public'))); // path config with express

app.use((req, res, next) => {
  User.findById('635151936812fda3e75f8764')
    .then(user => {
      req.user = user; //mongoose model 
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes); //web app routes for admin
app.use(shopRoutes); //shop routes for users
app.use(authRoutes); //authentication routes

app.use(errorController.get404); //use of 404 controller

//mongoose init and app init
mongoose.connect(`mongodb+srv://${usernamedb}:${passdb}@cluster0.ga01wzx.mongodb.net/shop?retryWrites=true&w=majority`)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'John',
          email: 'test@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })