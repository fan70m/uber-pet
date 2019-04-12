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
	app.get('/login_page', login_page);
	app.get('/loginfail', loginfail);

  /* PROTECTED GET */
	app.get('/userinfo', loggedIn, userinfo);
	app.get('/caretakerinfo', loggedIn, caretakerinfo);
	app.get('/appointments', loggedIn, appointments);
	app.get('/usefulinfo', loggedIn, usefulinfo);
	app.get('/register' , passport.antiMiddleware(), register );
	// app.get('/password' , passport.antiMiddleware(), retrieve ); <-- add this later
	app.get('/confirmation', passport.authMiddleware(), confirmation);
	app.get('/pricing', passport.authMiddleware(), pricing);
	app.get('/choose_pet', passport.authMiddleware(), choose_pet); //let do get for now. post later. Should it be protected?
	app.get('/review', passport.authMiddleware(), review);
	app.get('/delete_pet', passport.authMiddleware(), delete_pet);

	/* PROTECTED POST */
	app.post('/update_info', passport.authMiddleware(), update_info);
	app.post('/update_pass', passport.authMiddleware(), update_pass);
	app.post('/listings', loggedIn, listings);
	app.post('/add_pet', passport.authMiddleware(), add_pet);
	app.post('/rate', passport.authMiddleware(), rate);
	app.post('/reg_user', passport.antiMiddleware(), reg_user);
	app.post('/create_caretaker', create_caretaker);
	app.post('/update_price', update_price);
	app.post('/insert_avails', insert_avails);

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
	var username = req.user.username;
	var money = 0;
	pool.query(sql_query.query.inquire_account, [username], (err, data) => {
		if(err) {
			console.error("Error in find appointments", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			money = data.rows[0].balance;
		}
	})

	pool.query(sql_query.query.find_pets, [username], (err, data) => {
		if(err) {
			console.error("Error in find appointments", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			basic(req, res, 'userinfo', { money: money, data: data, info_msg: msg(req, 'info', 'Information updated successfully', 'Error in updating information'), pass_msg: msg(req, 'pass', 'Password updated successfully', 'Error in updating password'), auth: true });
		}
	})
}

function caretakerinfo(req, res, next) {
	var username = req.user.username;
	pool.query(sql_query.query.is_caretaker, [username], (err, data) => {
		if(err) {
			console.error("Error in is_caretaker", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			basic(req, res, 'caretakerinfo', { iscaretaker: data.rows[0].count == 1, info_msg: msg(req, 'info', 'Information updated successfully', 'Error in updating information'), pass_msg: msg(req, 'pass', 'Password updated successfully', 'Error in updating password'), auth: true });
		}
	})
}

function orderdetails(req, res, next) {
	res.render('orderdetails', { page: 'orderdetails', auth: true });
}

function review(req, res, next) {
	res.render('review', { page: 'review', auth: true, query: req.query});
}

function appointments(req, res, next) {
	var username = req.user.username;
	pool.query(sql_query.query.find_appointments, [username], (err, data) => {
		if(err) {
			console.error("Error in find appointments", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.render('appointments', { page: 'appointments', auth: true, data: data });
		}
	})
}

function usefulinfo(req, res, next) {
	var username = req.user.username;
	pool.query(sql_query.query.find_spending_on_each_caretaker, [username], (err, data) => {
		if(err) {
			console.error("Error in find_spending_on_each_caretaker", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.render('usefulinfo', { page: 'usefulinfo', auth: true, data: data });
		}
	})
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

function choose_pet(req, res, next) {
	var username = req.user.username;
	pool.query(sql_query.query.find_pets, [username], (err, data) => {
		if(err) {
			console.error("Error in find pets", err);
			res.redirect('/?info=fail');
		} else {
			console.log(req.query);
			res.render('choose_pet', { data: data, page: 'choose_pet', query: req.query,  auth: true });
		}
	})
}

function confirmation(req, res, next) {
	var petid = req.query.petid;

	pool.query(sql_query.query.find_petname, [petid], (err, data) => {
		if(err) {
			console.error("Error in find pets", err);
			res.redirect('/?info=fail');
		} else {
			console.log(req.query);
			res.render('confirmation', { page: 'confirmation', auth: true, data: data, ...req.query});
		}
	})
}

function pricing(req, res, next) {
	var petid = req.query.petid;
	var caretakerid = req.query.caretakerid;
	var starttime = req.query.starttime;
	var endtime = req.query.endtime;
	var db_starttime = req.query.db_starttime;
	var db_endtime = req.query.db_endtime;
	console.log(req.query);

	var date2 = new Date(starttime);
	var date1 = new Date(endtime);
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));

	var price = req.query.price
	var tot_price = parseInt(price) * (dayDifference + 1);

	console.log("tot_price", tot_price);

	//Plan B because cannot do a transaction
	pool.query(sql_query.query.make_appointment, [petid, caretakerid, starttime, endtime, price], (err, data) => {
		if(err) {
			console.error("Error in make_appointment", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
		}
	})

	pool.query(sql_query.query.increase_caretaker_account, [caretakerid, tot_price], (err, data) => {
		if(err) {
			console.error("Error in increase_caretaker_account", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
		}
	})

	pool.query(sql_query.query.decrease_petowner_account, [petid, tot_price], (err, data) => {
		if(err) {
			console.error("Error in decrease_petowner_account", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.render('pricing', { page: 'pricing', auth: true});
		}
	})
}

function delete_pet(req, res, next) {
	var petid = req.query.petid;
	console.log(req.query);

	pool.query(sql_query.query.delete_pet, [petid], (err, data) => {
		if(err) {
			console.error("Error in find pets", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.redirect('/userinfo?info=pass');
		}
	})
}

// POST
function listings(req, res, next) {
	var username  = req.user.username;
	var location = req.body.location;
	var starttime  = req.body.starttime;
	var endtime  = req.body.enddate;
	var specie = req.body.specie.toLowerCase();
	var locationid;

	pool.query(sql_query.query.find_appointment, [starttime, endtime, specie, location], (err, data) => {
		if(err) {
			console.error("Error in find appointment", err);
			res.redirect('/?info=fail');
		} else {
			console.log("args", locationid, specie, starttime, endtime);
			console.log(data);
			res.render('listings', { page: 'listings', auth: true, data: data, starttime: starttime, endtime: endtime });
		}
	})
}

function add_pet(req, res, next) {
	var username  = req.user.username;
	var petname = req.body.petname;
	var petspecie = req.body.pettype;
	console.log(req.body);
	pool.query(sql_query.query.add_pet, [petname, petspecie, username], (err, data) => {
		if(err) {
			console.error("Error in update info", err);
			res.redirect('/userinfo?info=fail');
		} else {
			res.redirect('/userinfo?info=pass');
		}
	});
}

function rate(req, res, next) {
	var appointmentid = req.query.appointmentid;
	var message = req.body.message;
	var rate = req.body.rate;
	console.log(req.query);
	console.log(req.body);
	pool.query(sql_query.query.add_rate, [appointmentid, message, rate], (err, data) => {
		if(err) {
			console.error("Error in update info", err);
			res.redirect('/review?info=fail');
		} else {
			res.redirect('/review?info=pass');
		}
	});
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

function create_caretaker(req, res, next) {
	console.log("create caretaker", req.body);
	var username  = req.user.username;
	var price  = req.body.price;

	//this is supposed to be a transaction but it doesn't work.
	// pool.query(sql_query.query.create_caretaker_and_update_avails, [username, price, starttime, endtime], (err, data) => {
	// 	if(err) {
	// 		console.error("Error in create caretaker", err);
	// 		res.redirect('/?info=fail');
	// 	} else {
	// 		console.log(data);
	// 		res.redirect('/?info=pass');
	// 	}
	// });

	//plan B
	pool.query(sql_query.query.create_caretaker, [username, price], (err, data) => {
		if(err) {
			console.error("Error in create caretaker", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.redirect('/?info=pass');
		}
	});
}

function insert_avails(req, res, next){
	var username  = req.user.username;
	var starttime  = req.body.starttime;
	var endtime  = req.body.endtime;

	pool.query(sql_query.query.insert_avails, [username, starttime, endtime], (err, data) => {
		if(err) {
			console.error("Error in insert_avails", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.redirect('/?info=pass');
		}
	});
}

function update_price(req, res, next){
	var username  = req.user.username;
	var price  = req.body.price;

	pool.query(sql_query.query.update_price, [username, price], (err, data) => {
		if(err) {
			console.error("Error in update_price", err);
			res.redirect('/?info=fail');
		} else {
			console.log(data);
			res.redirect('/?info=pass');
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

	pool.query(sql_query.query.add_user, [username,password,firstname,lastname,location], (err, data) => {
		if(err) {
			console.error("Error in adding user", err);
			res.redirect('/register?reg=fail');
		} else {
			req.login({
				username    : username,
				passwordHash: password,
				firstname   : firstname,
				lastname    : lastname
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
