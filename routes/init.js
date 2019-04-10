const sql_query = require('../sql');
const passport = require('passport');
const bcrypt = require('bcrypt')

// Postgre SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
  //ssl: true
});

const round = 10;
const salt  = bcrypt.genSaltSync(round);

function initRouter(app) {
	/* GET */
	app.get('/', index );
	app.get('/orderdetails', orderdetails); //let do get for now. post later. Should it be protected?
	app.get('/pricing', pricing); //let do get for now. post later. Should it be protected?
	app.get('/review', review); //let do get for now. post later. Should it be protected?
	app.get('/login_page', login_page); //let do get for now. post later. Should it be protected?
	app.get('/loginfail', loginfail); //let do get for now. post later. Should it be protected?

  /* PROTECTED GET */
	// app.get('/ownerdashboard', passport.authMiddleware(), ownerdashboard);
	app.get('/pets', passport.authMiddleware(), pets);
	app.get('/userinfo', passport.authMiddleware(), userinfo);
	// app.get('/caretakerdashboard', passport.authMiddleware(), caretakerdashboard);
	app.get('/appointments', passport.authMiddleware(), appointments);

	app.get('/register' , passport.antiMiddleware(), register );
	// app.get('/password' , passport.antiMiddleware(), retrieve ); <-- add this later

	/* PROTECTED POST */
	app.post('/update_info', passport.authMiddleware(), update_info);
	app.post('/update_pass', passport.authMiddleware(), update_pass);
	app.post('/listings', loggedIn, listings);

	app.post('/reg_user', passport.antiMiddleware(), reg_user);

	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/loginfail'
	}));

	/* LOGOUT */
	app.get('/logout', passport.authMiddleware(), logout);
}

// Middleware to redirect if not logged in
function loggedIn(req, res, next) {
	if (req.user) {
			next();
	} else {
			res.redirect('/login_page');
	}
}

// Render Function
function basic(req, res, page, other) {
	var info = {
		page: page,
		user: req.user.username,
		firstname: req.user.firstname,
		lastname : req.user.lastname,
	};
	if(other) {
		for(var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}
function query(req, fld) {
	return req.query[fld] ? req.query[fld] : '';
}
function msg(req, fld, pass, fail) {
	var info = query(req, fld);
	return info ? (info=='pass' ? pass : fail) : '';
}

// GET
function index(req, res, next) {
	res.render('index', { page: 'index', auth: false });
}

function userinfo(req, res, next) {
	basic(req, res, 'userinfo', { info_msg: msg(req, 'info', 'Information updated successfully', 'Error in updating information'), pass_msg: msg(req, 'pass', 'Password updated successfully', 'Error in updating password'), auth: true });
}

function orderdetails(req, res, next) {
	res.render('orderdetails', { page: 'orderdetails', auth: true });
}

function pricing(req, res, next) {
	res.render('pricing', { page: 'pricing', auth: true });
}

function review(req, res, next) {
	res.render('review', { page: 'review', auth: true });
}

function appointments(req, res, next) {
	res.render('appointments', { page: 'appointments', auth: true });
}

function pets(req, res, next) {
	res.render('pets', { page: 'pets', auth: true });
}

function register(req, res, next) {
	res.render('register', { page: 'register', auth: false });
}

function login_page(req, res, next) {
	res.render('login_page', { page: 'login_page', auth: false });
}

function loginfail(req, res, next) {
	res.render('loginfail', { page: 'loginfail', auth: false });
}

// POST
function listings(req, res, next) {
	var username  = req.user.username;
	var location = req.body.location;
	var startdate  = req.body.startdate;
	var enddate  = req.body.enddate;
	var specie = req.body.specie;
	var locationid;
	console.log(req.body);
	console.log("in listings", location, specie, startdate, enddate);


	pool.query(sql_query.query.find_location_id, [location], (err, data) => {
		if(err) {
			console.error("Location does not exist", err);
			res.redirect('/listings?reg=fail');
		} else {
			console.log(locationid = data);
			console.log(locationid = data.rows);
			locationid = data.rows[0]["areaid"];
			console.log("locationid", locationid);
		}
	});

	pool.query(sql_query.query.find_appointment, [locationid, specie, startdate, enddate], (err, data) => {
		if(err) {
			console.error("Error in find appointment", err);
			res.redirect('/listings?info=fail');
		} else {
			console.log("data", data);
			res.render('listings', { page: 'listings', auth: true, data: data });
		}
	})
}

function update_info(req, res, next) {
	var username  = req.user.username;
	var firstname = req.body.firstname;
	var lastname  = req.body.lastname;
	pool.query(sql_query.query.update_info, [username, firstname, lastname], (err, data) => {
		if(err) {
			console.error("Error in update info");
			res.redirect('/userinfo?info=fail');
		} else {
			res.redirect('/userinfo?info=pass');
		}
	});
}
function update_pass(req, res, next) {
	var username = req.user.username;
	var password = bcrypt.hashSync(req.body.password, salt);
	pool.query(sql_query.query.update_pass, [username, password], (err, data) => {
		if(err) {
			console.error("Error in update pass");
			res.redirect('/userinfo?pass=fail');
		} else {
			res.redirect('/userinfo?pass=pass');
		}
	});
}

function reg_user(req, res, next) {
	var username  = req.body.username;
	var password  = bcrypt.hashSync(req.body.password, salt);
	var firstname = req.body.firstname;
	var lastname  = req.body.lastname;
	var location  = req.body.location;
	var locationid = 1

	pool.query(sql_query.query.find_location_id, [location], (err, data) => {
		if(err) {
			console.error("Location does not exist", err);
			res.redirect('/register?reg=fail');
		} else {
			locationid = data.rows[0]["areaid"]
		}
	});

	pool.query(sql_query.query.add_user, [username,password,firstname,lastname,locationid], (err, data) => {
		if(err) {
			console.error("Error in adding user", err);
			res.redirect('/register?reg=fail');
		} else {
			req.login({
				username    : username,
				passwordHash: password,
				firstname   : firstname,
				lastname    : lastname,
				location    : locationid,
			}, function(err) {
				if(err) {
					return res.redirect('/register?reg=fail');
				} else {
					return res.redirect('/');
				}
			});
		}
	});
}


// LOGOUT
function logout(req, res, next) {
	req.session.destroy()
	req.logout()
	res.redirect('/')
}

module.exports = initRouter;
