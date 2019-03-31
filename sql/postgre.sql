CREATE TABLE Users (
	username   text   PRIMARY KEY,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL
);

CREATE TABLE Petowners (
	username 			text,
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users
);

CREATE TABLE Caretakers (
	username 			text,
	PRIMARY KEY (username),
	FOREIGN KEY (username) REFERENCES Users
);

INSERT INTO Users (username, password, first_name, last_name)
VALUES ('username@gmail.com', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'Fan', 'Chen');
INSERT INTO Users (username, password, first_name, last_name)
VALUES ('otherusername@gmail.com', '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'Firstname', 'Lastname');
