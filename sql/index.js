const sql = {}

sql.query = {
	// Login
	userpass: 'SELECT * FROM username_password WHERE username=$1',

	// Update
	update_info: 'UPDATE username_password SET first_name=$2, last_name=$3 WHERE username=$1',
	update_pass: 'UPDATE username_password SET password=$2 WHERE username=$1',
}

module.exports = sql
