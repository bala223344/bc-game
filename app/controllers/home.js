

exports.loggedIn = function(req, res, next)
{
    console.log('comgin');
    
	if (req.isAuthenticated()) { // req.session.passport._id

		next();

	} else {


		res.redirect('/login');

	}

}

exports.index = function(req, res) {
    console.log('thehw');
    
    res.render('home/index', {
        
    });
}



exports.login = function(req, res) {
    console.log('mam');


	if (req.isAuthenticated()) {

		res.redirect('/');

	} else {

		res.render('home/login', {
			session:req.session,
		});

	}
	
}
