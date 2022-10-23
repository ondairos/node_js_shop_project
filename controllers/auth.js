const bcrypt = require('bcryptjs'); //encrypt passwords
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const helper = require('../helper'); //helper js file

const sendgridApiEnv = process.env.SNDGRID_API;
const personalEmail = process.env.PRSNL_EMAIL;

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({  //sendgrid init with api key
  auth: {
    api_key: sendgridApiEnv
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.'); //flash message 
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.'); //flash message
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};


exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email }).then(userDoc => {
    if (userDoc) {
      req.flash('error', 'Email exists already. Please choose another one.');
      return res.redirect('/signup'); //user exists
    }
    return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] }
        });
        return user.save();
      })
      .then(result => {
        res.redirect('/login'); //user created
        return transporter.sendMail({
          to: email,
          from: personalEmail,
          subject: 'SIGNUP successfull!',
          html: '<h1>You have successfully signed up!!! (-.-) </h1>'
        });

      }).catch(err => {
        console.log(err);
      })
  })
    .catch(err => {
      console.log(err);
    });

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
