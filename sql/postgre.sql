CREATE TABLE Areas(
	areaid SERIAL PRIMARY KEY,
	areaname varchar(64) NOT NULL
);

INSERT INTO Areas (areaname)
VALUES ('Taipei');
INSERT INTO Areas (areaname)
VALUES ('Singapore');

CREATE TABLE AnimalSpecies (
	animalid SERIAL PRIMARY KEY,
	animalname varchar(64) NOT NULL
);

INSERT INTO AnimalSpecies (animalname) VALUES ('dog');
INSERT INTO AnimalSpecies (animalname) VALUES ('cat');

CREATE TABLE Pets(
	petid SERIAL PRIMARY KEY,
	petname text NOT NULL,
	specieid integer NOT NULL,
	ownername text NOT NULL,
	FOREIGN KEY (specieid) REFERENCES AnimalSpecies(animalid)
);

INSERT INTO Pets (petname,specieid,ownername)
VALUES ('A',1,'Tom');
INSERT INTO Pets (petname,specieid,ownername)
VALUES ('B',2,'Jack');


CREATE TABLE Petavailabilities(
	petid integer PRIMARY KEY,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime),
	FOREIGN KEY (petid) REFERENCES Pets(petid)
);

INSERT INTO Petavailabilities (petid,starttime,endtime)
VALUES (1,'2019-01-01','2019-04-01');
INSERT INTO Petavailabilities (petid,starttime,endtime)
VALUES (2,'2019-03-01','2019-08-01');


CREATE TABLE Appointments(
	appointmentid SERIAL PRIMARY KEY,
	petid integer NOT NULL,
	petownername text NOT NULL,
	caretakername text NOT NULL,
	starttime date NOT NULL,
	endtime date NOT NULL,
	FOREIGN KEY (petid) REFERENCES Pets(petid),
	unique (starttime, endtime)
);

INSERT INTO Appointments(petid,petownername,caretakername,starttime,endtime)
VALUES (1,'Tom','Lily','2019-02-01','2019-02-15');
INSERT INTO Appointments(petid,petownername,caretakername,starttime,endtime)
VALUES (2,'Jack','Kelly','2019-04-12','2019-04-20');


CREATE TABLE Users (
	userid SERIAL PRIMARY KEY,
	username text NOT NULL UNIQUE,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL,
	areaid integer NOT NULL,
	FOREIGN KEY (areaid) REFERENCES Areas(areaid)
);

INSERT INTO Users (username, password, first_name, last_name,areaid)
VALUES ('username@gmail.com', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'Fan', 'Chen',1);
INSERT INTO Users (username, password, first_name, last_name,areaid)
VALUES ('otherusername@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'Firstname', 'Lastname',2);


CREATE TABLE Petowners (
	userid 			integer PRIMARY KEY,
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

INSERT INTO Petowners (userid)
VALUES (1);
INSERT INTO Petowners (userid)
VALUES (2);


CREATE TABLE Caretakers (
	userid 			integer PRIMARY KEY,
	rate integer NOT NULL,
	price integer NOT NULL,
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

INSERT INTO Caretakers(userid,rate,price)
VALUES(1,4,20);
INSERT INTO Caretakers(userid,rate,price)
VALUES(2,3,15);

CREATE TABLE AnimalServices (
	animalid INTEGER NOT NULL,
	caretakersid integer NOT NULL,
	FOREIGN KEY (animalid) REFERENCES AnimalSpecies(animalid),
	FOREIGN KEY (caretakersid) REFERENCES Caretakers(userid),
	PRIMARY KEY (animalid, caretakersid)
);

INSERT INTO AnimalServices (animalid, caretakersid) VALUES (1, 1);
INSERT INTO AnimalServices (animalid, caretakersid) VALUES (2, 1);
INSERT INTO AnimalServices (animalid, caretakersid) VALUES (2, 2);

CREATE TABLE Caretakeravailabilities(
	caretakerid integer PRIMARY KEY,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime),
	FOREIGN KEY (caretakerid) REFERENCES Caretakers(userid)
);

INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (1, '2019-01-01','2019-04-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (2, '2019-03-01','2019-08-01');

CREATE TABLE Rates(
	appointmentid integer PRIMARY KEY,
	caretakerid integer NOT NULL,
	rate integer NOT NULL,
	comment text,
	FOREIGN KEY (appointmentid) REFERENCES Appointments(appointmentid),
	FOREIGN KEY (caretakerid) REFERENCES Users(userid)
);

INSERT INTO rates(appointmentid,caretakerid,rate,comment)
VALUES(1,1,4,'He is good');
INSERT INTO rates(appointmentid,caretakerid,rate,comment)
VALUES(2,2,3,'He is bad');



CREATE TABLE Payments(
	paymentid SERIAL PRIMARY KEY,
	credit numeric NOT NULL,
	petownerid integer NOT NULL,
	FOREIGN KEY (petownerid) REFERENCES Petowners(userid)
);

INSERT INTO Payments(credit,petownerid)
VALUES(600,1);
INSERT INTO Payments(credit,petownerid)
VALUES(450,2);



CREATE TABLE Accounts(
	accountid SERIAL PRIMARY KEY,
	balance integer NOT NULL,
	userid integer,
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

INSERT INTO Accounts(balance, userid)
VALUES(1000,1);
INSERT INTO Accounts(balance, userid)
VALUES(1500,2);
