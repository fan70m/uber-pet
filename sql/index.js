const sql = {}

sql.query = {

  // Insertion
    add_user: 'INSERT INTO Users (username, password, first_name, last_name) VALUES ($1,$2,$3,$4)',
  //for now, i'll just use username(email) as the primary key
  //if we want an int id, we can follow what they do in this link
  //https://www.viget.com/articles/generate-unique-identifiers-with-postgres-sequences/

	// Login
	userpass: 'SELECT * FROM Users WHERE username=$1',

	// Update
	update_info: 'UPDATE Users SET first_name=$2, last_name=$3 WHERE username=$1',
    update_pass: 'UPDATE Users SET password=$2 WHERE username=$1',

    //insert area
    add_area: 'INSERT INTO Areas(areaid, areaname) VALUES($1,$2)',
    //update area
    update_area: 'UPDATE Areas SET areaname=$2 WHERE username=$1',

    //insert pet
    add_pet: 'INSERT INTO Pets(petid, petname, type, starttime, endtime) VALUES($1,$2,$3,$4,$5)',
    update_area: 'UPDATE Pets SET petname=$2, type=$3, starttime=$4, endtime=$5 WHERE username=$1',

    //new appointment
    add_appointment: 'INSERT INTO appointments(appointmentid, petid, petownername, caretakername, starttime, endtime) VALUES($1,$2,$3,$4,$5,$6)',

    //new rate
    add_rate: 'INSERT INTO Rate(appointmentid, userid, comment) VALUES($1,$2,$3)',
    //delete rate
    //delete_rate: ''


    //new payment
    add_payment: 'INSERT INTO Payment(paymentid, credit) VALUES($1,$2)',
    //inquire payment history
    //inquire_payment: 'SELECT'

    //new account
    add_account: 'INSERT INTO Accounts(accountid, balance, userid) VALUES($1,$2,$3)',

    //find pet caretaker need to choose the animal type
    find_caretaker: 'SELECT Caretakers.username FROM Caretaker, Petowners WHERE Petowners.username=$1 and Petowners.starttime>=Caretaker.starttime and Petowners.endtime<=Caretaker.endtime',


    //aftertime
    //after_time:''

    //add service table


    //inquire account
    inquire_account: 'SELECT balance FROM Accounts WHERE userid=$3',

    //inquire appointment
    inquire_appointment: 'SELECT * FROM appointments, Petowners, Users WHERE appointments.petid=Petowners.petid and Petowners.username=Users.username and Users.username=$1',





}

console.log("hello");

module.exports = sql
