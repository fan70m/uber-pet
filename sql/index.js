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
  add_appointment: 'INSERT INTO appointments(appointmentid, petid, petownername, caretakername, starttime, endtime) VALUES($1,$2,$3,$4,$5,$6)',


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

  find_appointment: "SELECT caretakerid, starttime, endtime FROM Caretakeravailabilities as avails where avails.caretakerid in (\
    SELECT users.userid FROM users inner join Caretakers on users.userid = caretakers.userid where areaid = $1\
    and $2 in (SELECT distinct animalname FROM AnimalSpecies natural join AnimalServices where AnimalServices.caretakerid = avails.caretakerid)\
  ) and avails.starttime >= $3 and avails.endtime <= $4;"

}

console.log("hello");

module.exports = sql
