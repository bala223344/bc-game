var home = require('../app/controllers/home');


module.exports = function (app, passport) {
    
    app.get('/', home.loggedIn,  home.index)
    app.get('/info', home.loggedIn, function(req, res) {
        //console.log(req.user)
        res.json(req.user);
    });

    app.get('/login',  home.login)
    
    app.get('/auth/discord', passport.authenticate('discord'));
    app.get('/auth/discord/callback', passport.authenticate('discord', {
        failureRedirect: '/'
    }), function(req, res) {
        // status = "Authenticated successfully";
        // socket.emit("loginResponse", {
        //     status: status,
        //     id: user.id,
        //     username: user.username
        // });
        res.redirect('/') // Successful auth
    });
      app.get('/logout', function(req, res) {
        //req.logout();
        req.session.destroy()
        res.redirect('/');
    });

    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

    // function checkAuth(req, res, next) {
    //     if (req.isAuthenticated()) return next();
    //     res.send('not logged in :(');
    // }
}
            