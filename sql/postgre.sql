CREATE TABLE Users (
	username   text   PRIMARY KEY,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL,
	areaid integer NOT NULL,
	FOREIGN KEY (areaid) REFERENCES Areas(areaid)
);

CREATE TABLE Petowners (
	username 			text,
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users,
	FOREIGN KEY (username) REFERENCES Pets(petid)
);

CREATE TABLE Caretakers (
	username 			text,
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime)
);

INSERT INTO Users (username, password, first_name, last_name)
VALUES ('username@gmail.com', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'Fan', 'Chen');
INSERT INTO Users (username, password, first_name, last_name)
VALUES ('otherusername@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'Firstname', 'Lastname');

CREATE TABLE Areas(
	areaid integer PRIMARY KEY,
	areaname varchar(64) NOT NULL
);

CREATE TABLE Pets(
	petid integer PRIMARY KEY,
	type varchar(64) NOT NULL,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime)
);

CREATE TABLE Appointments(
	appointmentid integer PRIMARY KEY,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime)
);

CREATE TABLE Rate(
	appointmentid integer NOT NULL,
	userid integer NOT NULL,
	FOREIGN KEY (appointmentid) REFERENCES Appointments(appointmentid),
	FOREIGN KEY (userid) REFERENCES Users(userid),
);

CREATE TABLE Payment(
	paymentid integer PRIMARY KEY,
	credit numberic NOT NULL,
	unique (paymentid, credit)
);

CREATE TABLE Accounts(
	accountid integer PRIMARY KEY,
	balance numberic NOT NULL,
	userid integer,
	FOREIGN KEY (userid) REFERENCES Users(userid),
	unique (userid, accountid)
);


