CREATE TABLE Areas(
	areaid SERIAL PRIMARY KEY,
	areaname varchar(64) NOT NULL
);

INSERT INTO Areas (areaname)
VALUES ('Taipei');
INSERT INTO Areas (areaname)
VALUES ('Singapore');


CREATE TABLE Pets(
	petid SERIAL PRIMARY KEY,
	petname text NOT NULL,
	specie varchar(64) NOT NULL,
	ownername text NOT NULL
);

INSERT INTO Pets (petname,specie,ownername)
VALUES ('A','dog','Tom');
INSERT INTO Pets (petname,specie,ownername)
VALUES ('B','cat','Jack');


CREATE TABLE petavailability(
	petid integer PRIMARY KEY,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime),
	FOREIGN KEY (petid) REFERENCES Pets(petid)
);

INSERT INTO petavailability (petid,starttime,endtime)
VALUES (1,'2019-01-01','2019-04-01');
INSERT INTO petavailability (petid,starttime,endtime)
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

INSERT INTO appointments(petid,petownername,caretakername,starttime,endtime)
VALUES (1,'Tom','Lily','2019-02-01','2019-02-15');
INSERT INTO appointments(petid,petownername,caretakername,starttime,endtime)
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
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

INSERT INTO Caretakers (userid)
VALUES (1);
INSERT INTO Caretakers (userid)
VALUES (2);



CREATE TABLE caretakeravailability(
	caretakerid integer PRIMARY KEY,
	specie text NOT NULL,
	starttime date NOT NULL,
	endtime date NOT NULL,
	unique (starttime, endtime),
	FOREIGN KEY (caretakerid) REFERENCES Caretakers(userid)
);

INSERT INTO caretakeravailability (caretakerid,specie,starttime,endtime)
VALUES (1,'dog','2019-01-01','2019-04-01');
INSERT INTO caretakeravailability (caretakerid,specie,starttime,endtime)
VALUES (2,'cat','2019-03-01','2019-08-01');


CREATE TABLE service(
	caretakerid integer PRIMARY KEY,
	rate integer NOT NULL,
	price integer NOT NULL,
	FOREIGN KEY (caretakerid) REFERENCES caretakers(userid)
);

INSERT INTO service(caretakerid,rate,price)
VALUES(1,4,20);
INSERT INTO service(caretakerid,rate,price)
VALUES(2,3,15);


CREATE TABLE Rate(
	appointmentid integer PRIMARY KEY,
	caretakerid integer NOT NULL,
	rate integer NOT NULL,
	comment text,
	FOREIGN KEY (appointmentid) REFERENCES Appointments(appointmentid),
	FOREIGN KEY (caretakerid) REFERENCES Users(userid)
);

INSERT INTO rate(appointmentid,caretakerid,rate,comment)
VALUES(1,1,4,'He is good');
INSERT INTO rate(appointmentid,caretakerid,rate,comment)
VALUES(2,2,3,'He is bad');



CREATE TABLE Payment(
	paymentid SERIAL PRIMARY KEY,
	credit numeric NOT NULL,
	petownerid integer NOT NULL,
	FOREIGN KEY (petownerid) REFERENCES Petowners(userid)
);

INSERT INTO payment(credit,petownerid)
VALUES(600,1);
INSERT INTO payment(credit,petownerid)
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
