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


}

module.exports = sql
