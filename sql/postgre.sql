CREATE TABLE Areas(
	areaid SERIAL PRIMARY KEY,
	areaname varchar(64) NOT NULL
);

INSERT INTO Areas (areaname)
VALUES ('Taipei');
INSERT INTO Areas (areaname)
VALUES ('Singapore');

CREATE TABLE Users (
	userid SERIAL PRIMARY KEY,
	username text NOT NULL UNIQUE,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL,
	areaid integer NOT NULL,
	FOREIGN KEY (areaid) REFERENCES Areas(areaid)
);

CREATE TABLE Accounts(
	userid integer PRIMARY KEY,
	balance integer NOT NULL,
	CONSTRAINT for_key_account FOREIGN KEY (userid) REFERENCES Users(userid) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE Petowners (
	userid integer PRIMARY KEY,
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

CREATE OR REPLACE FUNCTION create_account() RETURNS TRIGGER AS
$BODY$
BEGIN
	INSERT INTO Accounts(userid, balance)
	VALUES(new.userid, 0);
	RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER create_account_trig AFTER INSERT ON Users FOR EACH ROW EXECUTE PROCEDURE create_account();

CREATE OR REPLACE FUNCTION create_petonwers() RETURNS TRIGGER AS
$BODY$
BEGIN
 INSERT INTO Petowners(userid)
 VALUES (new.userid);
 RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER create_petonwers AFTER INSERT ON Users FOR EACH ROW EXECUTE PROCEDURE create_petonwers();

START TRANSACTION;

SET CONSTRAINTS ALL DEFERRED;

INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('username@gmail.com', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'Fan', 'Chen', 1);
INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('otherusername@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'Firstname', 'Lastname', 2);
INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('fanychen@live.ca', '$2b$10$TiuAOuMlsMm5QUC1No8n3uyuGYXLXY2gd/azVOJ/QBcoLJ6bJApDK', 'asdf', 'asdf', 2);
INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('bla@gmail.com', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'caretaker3', 'area1', 1);
INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('blabla@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'caretaker4', 'area2', 2);
INSERT INTO Users (username, password, first_name, last_name, areaid)
VALUES ('blablabla@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'caretaker4', 'area2', 2);

COMMIT TRANSACTION;

-- INSERT INTO Petowners (userid)
-- VALUES (1);
-- INSERT INTO Petowners (userid)
-- VALUES (2);
-- INSERT INTO Petowners (userid)
-- VALUES (3);

CREATE TABLE AnimalSpecies (
	animalid SERIAL PRIMARY KEY,
	animalname varchar(64) NOT NULL
);

INSERT INTO AnimalSpecies (animalname) VALUES ('dog');
INSERT INTO AnimalSpecies (animalname) VALUES ('cat');
INSERT INTO AnimalSpecies (animalname) VALUES ('goldfish');
INSERT INTO AnimalSpecies (animalname) VALUES ('rabbit');
INSERT INTO AnimalSpecies (animalname) VALUES ('hamster');
INSERT INTO AnimalSpecies (animalname) VALUES ('other');

CREATE TABLE Caretakers (
	userid integer PRIMARY KEY,
	rate integer NULL,
	price integer NOT NULL,
	FOREIGN KEY (userid) REFERENCES Users(userid)
);

CREATE TABLE AnimalServices (
	animalid INTEGER NOT NULL,
	caretakerid integer NOT NULL,
	FOREIGN KEY (animalid) REFERENCES AnimalSpecies(animalid),
	FOREIGN KEY (caretakerid) REFERENCES Caretakers(userid),
	PRIMARY KEY (animalid, caretakerid)
);

CREATE OR REPLACE FUNCTION add_default_pets() RETURNS TRIGGER AS
$BODY$
BEGIN
 INSERT INTO AnimalServices(animalid, caretakerid)
 VALUES ((select animalid from animalspecies where animalname = 'goldfish'), new.userid);
 INSERT INTO AnimalServices(animalid, caretakerid)
 VALUES ((select animalid from animalspecies where animalname = 'hamster'), new.userid);
 RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER add_default_pets AFTER INSERT ON Caretakers FOR EACH ROW EXECUTE PROCEDURE add_default_pets();

INSERT INTO Caretakers(userid,rate,price)
VALUES(1,4,20);
INSERT INTO Caretakers(userid,rate,price)
VALUES(2,3,15);
INSERT INTO Caretakers(userid,price)
VALUES(4,16);
INSERT INTO Caretakers(userid,price)
VALUES(5,17);
INSERT INTO Caretakers(userid,price)
VALUES(6,18);

INSERT INTO AnimalServices (animalid, caretakerid) VALUES (1, 1);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (2, 1);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (2, 2);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (1, 4);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (2, 4);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (1, 5);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (1, 6);
INSERT INTO AnimalServices (animalid, caretakerid) VALUES (2, 6);

CREATE TABLE Pets(
	petid SERIAL PRIMARY KEY,
	petname text NOT NULL,
	specieid integer NOT NULL,
	ownerid integer NOT NULL,
	FOREIGN KEY (specieid) REFERENCES AnimalSpecies(animalid),
	FOREIGN KEY (ownerid) REFERENCES Petowners(userid)
);

INSERT INTO Pets (petname,specieid, ownerid)
VALUES ('A',1,1);
INSERT INTO Pets (petname,specieid, ownerid)
VALUES ('B',2,2);
INSERT INTO Pets (petname,specieid, ownerid)
VALUES ('Ac',1,3);
INSERT INTO Pets (petname,specieid, ownerid)
VALUES ('By',2,3);

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
	caretakerid integer NOT NULL,
	starttime date NOT NULL,
	endtime date NOT NULL,
	FOREIGN KEY (petid) REFERENCES Pets(petid),
	FOREIGN KEY (caretakerid) REFERENCES Caretakers(userid)
);

INSERT INTO Appointments(petid, caretakerid, starttime, endtime)
VALUES (1, 1, '2019-02-01', '2019-02-15');
INSERT INTO Appointments(petid, caretakerid, starttime, endtime)
VALUES (2, 2, '2019-03-12', '2019-03-20');
INSERT INTO Appointments(petid, caretakerid, starttime, endtime)
VALUES (2, 2, '2019-03-22', '2019-03-23');
INSERT INTO Appointments(petid, caretakerid, starttime, endtime)
VALUES (4, 4, '2019-04-01', '2019-04-01');

CREATE TABLE Caretakeravailabilities(
	caretakerid integer NOT NULL,
	starttime date NOT NULL,
	endtime date NOT NULL,
	PRIMARY KEY(caretakerid,starttime,endtime),
	FOREIGN KEY (caretakerid) REFERENCES Caretakers(userid),
	CHECK (starttime <  endtime)
);

INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (1, now(), now() + INTERVAL '10 DAY');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (2, '2019-03-01','2019-08-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (5, '2019-03-01','2019-08-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (4, '2019-03-01','2019-04-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (4, '2019-04-02','2019-08-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (6, '2019-03-01','2019-04-01');
INSERT INTO Caretakeravailabilities (caretakerid,starttime,endtime)
VALUES (6, '2019-04-02','2019-08-01');

CREATE TABLE Rates(
	appointmentid integer PRIMARY KEY,
	caretakerid integer NOT NULL,
	rate integer NOT NULL,
	comment text,
	FOREIGN KEY (appointmentid) REFERENCES Appointments(appointmentid),
	FOREIGN KEY (caretakerid) REFERENCES Users(userid)
);

CREATE OR REPLACE FUNCTION update_rate() RETURNS TRIGGER AS
$BODY$
BEGIN
	UPDATE Caretakers SET rate = CASE
		WHEN (select sum(rate) from Rates where caretakerid = NEW.caretakerid) IS NULL
		THEN NEW.rate
		ELSE ((select sum(rate) from Rates where caretakerid = NEW.caretakerid) + NEW.rate) / ((select count(1) from Rates where caretakerid = NEW.caretakerid)+1)
	END
	WHERE userid = NEW.caretakerid;
	RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER update_rate AFTER INSERT ON Rates FOR EACH ROW EXECUTE PROCEDURE update_rate();

INSERT INTO rates(appointmentid,caretakerid,rate,comment)
VALUES(1,1,4,'He is good');
INSERT INTO rates(appointmentid,caretakerid,rate,comment)
VALUES(2,2,3,'He is bad');
INSERT INTO rates(appointmentid,caretakerid,rate)
VALUES(3,2,2);

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
