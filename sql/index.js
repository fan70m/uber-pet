const sql = {}

sql.query = {

  // Insertion ok
    add_user: 'INSERT INTO Users (username, userid, password, first_name, last_name, areaid) VALUES ($1,$2,$3,$4,$5,$6)',
  //for now, i'll just use username(email) as the primary key
  //if we want an int id, we can follow what they do in this link
  //https://www.viget.com/articles/generate-unique-identifiers-with-postgres-sequences/

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
    add_pet: 'INSERT INTO Pets(petid, petname, type, ownername) VALUES($1,$2,$3,$4)',
    //update pet ok
    update_area: 'UPDATE Pets SET petname=$2, type=$3, ownername=$4 WHERE username=$1',

    //new petavailability ok
    add_petavailability:'INSERT INTO petavailability(petid,starttime,endtime) VALUES($1,$2,$3)',
    //update petavailability ok
    update_petavailability:'UPDATE petavailability SET starttime=$2, endtime=$3 WHERE petid=$1',


    //new appointment ok
    add_appointment: 'INSERT INTO appointments(appointmentid, petid, petownername, caretakername, starttime, endtime) VALUES($1,$2,$3,$4,$5,$6)',


    //new petonwnr ok
    add_petowner:'INSERT INTO petowners(userid) VALUES ($1)',

    //new caretaker ok
    add_caretaker:'INSERT INTO caretakers(userid) VALUES($1)',

    //new caretakeravailability ok
    add_caretakeravailability:'INSERT INTO caretakeravailability(caretakerid, starttime, endtime) VALUES ($1,$2,$3)',
    //update caretakeravailability ok
    update_caretakeravailability:'UPDATE caretakeravailability SET starttime=$2, endtime=$3 WHERE caretakerid=$1',

    //new service ok
    add_service:'INSERT INTO service(caretakerid,rate,price) VALUES ($1,$2,$3)',
    update_service:'UPDATE service SET rate=$2,price=$3 WHERE caretakerid=$1',

    //new rate ok
    add_rate: 'INSERT INTO Rate(appointmentid, caretakerid, rate, comment) VALUES($1,$2,$3,$4)',
    //delete rate ok
    delete_rate: 'DELETE FROM rate where appointmentid=$1',

    //new payment ok
    add_payment: 'INSERT INTO Payment(paymentid, credit,petownerid) VALUES($1,$2,$3)',


    //new account ok
    add_account: 'INSERT INTO Accounts(accountid, balance, userid) VALUES($1,$2,$3)',

    //inquire account ok
    inquire_account: 'SELECT balance FROM Accounts WHERE userid=$3',

    //find pet caretaker need to choose the animal type

    //inquire payment history

    //inquire appointment
    inquire_appointment: 'SELECT * FROM appointments, Petowners, Users WHERE appointments.petid=Petowners.userid and Petowners.userid=Users.userid and Users.userid=$2',


}

console.log("hello");

module.exports = sql
