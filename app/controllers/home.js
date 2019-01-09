

exports.loggedIn = function(req, res, next)
{
    
	if (req.isAuthenticated()) { // req.session.passport._id

       
		next();

	} else {

        

		res.redirect('/login');

	}

}

exports.index = function(req, res) {
	


	//res.render('home/index', {username:req.user.username, id:req.user.id});
	res.render('home/index', req.user);
}



exports.login = function(req, res) {


	if (req.isAuthenticated()) {

		res.redirect('/');

	} else {

		res.render('home/login', {
			session:req.session,
		});

	}
	
}
