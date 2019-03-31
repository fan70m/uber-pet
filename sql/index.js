const sql = {}

sql.query = {

  // Insertion
  add_user: 'INSERT INTO username_password (username, password, first_name, last_name) VALUES ($1,$2,\'Bronze\',$3,$4)',

	// Login
	userpass: 'SELECT * FROM username_password WHERE username=$1',

	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
  update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',


}

module.exports = sql
