# uber-pet

Instructions:

1. Follow the steps on the `start_guide.pdf` file on IVLE to download node, install npm, etc (the first few pages).
2. Create a new database instead of using the default postgres. E.g. `CREATE DATABASE databasename`. 
2. Open terminal and be sure you are in the uber-pet folder. Run `psql -d databasename` in your terminal. 
3. Now you should be in pqsl. Tun `\i sql/drop_table.sql` and `\i sql/postgre.sql`. This will create the database and populate it with dummy data.
4. Create a new file called `.env` in your local environment with the line below:
`DATABASE_URL=postgres://<db-user-name>:<db-password>@localhost:5432/<databasename>`
Replace `<db-user-name>, <db-password>, and <databasename>` with your local info on the database you are using.
4. To run the app locally, do `npm install` then `node bin/www`

To understand node.js + express, see the `start_guide.pdf` file on IVLE

To use the app, you can login with the credentials in `sql/passwords.txt` or register a new account.
