const sql = {}

sql.query = {

  // Insert new user ok
  add_user: 'INSERT INTO Users (username, password, first_name, last_name, areaid) VALUES ($1,$2,$3,$4,$5)',
  //for now, i'll just use username(email) as the primary key

	// Login ok
	userpass: 'SELECT * FROM Users WHERE username=$1',

	// Update ok
	update_info: 'UPDATE Users SET first_name=$4, last_name=$5 WHERE username=$1',
  update_pass: 'UPDATE Users SET password=$3 WHERE username=$1',

  //insert area ok
  add_area: 'INSERT INTO Areas(areaid, areaname) VALUES($1,$2)',
  //update area ok
  update_area: 'UPDATE Areas SET areaname=$2 WHERE areaid=$1',

  //insert pet ok
  add_pet: 'INSERT INTO Pets(petid, petname, specie, ownername) VALUES($1,$2,$3,$4)',
  //update pet ok
  update_area: 'UPDATE Pets SET petname=$2, specie=$3, ownername=$4 WHERE username=$1',

  //new petavailability ok
  add_petavailability:'INSERT INTO petavailabilities(petid,starttime,endtime) VALUES($1,$2,$3)',
  //update petavailability ok
  update_petavailability:'UPDATE petavailabilities SET starttime=$2, endtime=$3 WHERE petid=$1',

  //new appointment ok
  make_appointment: "INSERT INTO Appointments(petid, caretakerid, starttime, endtime) VALUES ($1, $2, $3, $4);",

  //new petonwnr ok
  add_petowner:'INSERT INTO petowners(userid) VALUES ($1)',

  //new caretaker ok
  add_caretaker:'INSERT INTO caretakers(userid,rate,price) VALUES($1,$2,$3)',

  //new caretakeravailability ok
  add_caretakeravailability:'INSERT INTO caretakeravailabilities(caretakerid, starttime, endtime) VALUES ($1,$2,$3)',
  //update caretakeravailability ok
  update_caretakeravailability:'UPDATE caretakeravailabilities SET starttime=$2, endtime=$3 WHERE caretakerid=$1',

  //new rate ok
  add_rate: 'INSERT INTO Rates(appointmentid, caretakerid, rate, comment) VALUES($1,$2,$3,$4)',
  //delete rate ok
  delete_rate: 'DELETE FROM Rates where appointmentid=$1',

  //new payment ok
  add_payment: 'INSERT INTO Payments(paymentid, credit,petownerid) VALUES($1,$2,$3)',

  //new account ok
  add_account: 'INSERT INTO Accounts(accountid, balance, userid) VALUES($1,$2,$3)',

  //inquire account ok
  inquire_account: 'SELECT balance FROM Accounts WHERE userid=$3',

  //find pet caretaker need to choose the animal specie

  //inquire payment history

  //inquire appointment
  inquire_appointment: 'SELECT * FROM appointments, Petowners, Users WHERE appointments.petid=Petowners.userid and Petowners.userid=Users.userid and Users.userid=$2',

  find_location_id: "SELECT areaid FROM areas where areaname=$1",

  //find caretaker that satisfies all requirements
  find_appointment: "WITH all_possible_caretakers AS (\
    SELECT caretakerid, starttime, endtime FROM Caretakeravailabilities AS avails\
    WHERE avails.caretakerid IN (\
      SELECT users.userid FROM Users INNER JOIN Caretakers ON users.userid = caretakers.userid WHERE areaid = (SELECT areaid FROM areas where areaname=$4)\
    ) AND avails.starttime <= $1\
    AND avails.endtime >= $2\
    AND $3 IN (SELECT distinct animalname FROM AnimalSpecies natural join AnimalServices where AnimalServices.caretakerid = avails.caretakerid)) \
  SELECT caretakerid, rate, price, starttime, endtime FROM all_possible_caretakers INNER JOIN caretakers ON caretakers.userid = all_possible_caretakers.caretakerid;",

  find_pets: "SELECT petid, petname, specieid FROM pets WHERE ownerid = (SELECT userid FROM users WHERE username = $1);",

  find_price: "SELECT price FROM caretakers where caretakerid = $1;",

  find_petname: "SELECT petname FROM pets where petid = $1;",

  //find all appointments based on owner id
  find_appointments: "SELECT U.first_name, U.last_name, U.username, A.starttime, A.endtime, P.petname\
  FROM Appointments as A inner join Users as U on A.caretakerid = U.userid inner join Pets as P on A.petid = P.petid\
  where P.ownerid = (select userid from users where username = $1);",

}

module.exports = sql
