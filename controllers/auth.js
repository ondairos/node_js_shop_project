const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    //session
    User.findById('635151936812fda3e75f8764')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user; //share across requests
            req.session.save(err => {  //redirect after the session is created in the mongodb and not before
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    }); //method of the package mongodb-session
};