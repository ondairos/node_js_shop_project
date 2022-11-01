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
const flash = require('connect-flash'); //flash error messages through session
const multer = require('multer'); //multer for upload/download files

const errorController = require('./controllers/error'); //404 controller
const User = require('./models/user'); //user model

const MONGODB_URI = `mongodb+srv://${usernamedb}:${passdb}@cluster0.ga01wzx.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();  //main express init
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

//filestorage with multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); //storing files with unique name multer
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');  //EJS as the template engine
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));   //bodyparser config
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); //multer usage for file upload donwload
app.use(express.static(path.join(__dirname, 'public'))); // path config with express
app.use('/images', express.static(path.join(__dirname, 'images'))); // images static middleware

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);  //session middleware

app.use(flash()); //flash middleware for error messages

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user; //mongoose model for user
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});


app.use('/admin', adminRoutes); //web app routes for admin
app.use(shopRoutes); //shop routes for users
app.use(authRoutes); //authentication routes

// app.get('/500', errorController.get500); //500 error

app.use(errorController.get404); //use of 404 controller

app.use((error, req, res, next) => { //central error handler
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});


//mongoose init and app init
mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  })