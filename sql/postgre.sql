CREATE TABLE username_password (
	username   varchar(9)  PRIMARY KEY,
	password   varchar(64) NOT NULL,
	first_name varchar(64) NOT NULL,
	last_name  varchar(64) NOT NULL
);

INSERT INTO username_password (username, password, first_name, last_name)
VALUES ('username', '$2b$10$vS4KkX8uenTCNooir9vyUuAuX5gUhSGVql8yQdsDDD4TG8bSUjkt.', 'Fan', 'Chen');
INSERT INTO username_password (username, password, first_name, last_name)
VALUES ('otherusername'   , '$2b$10$Pdcb3BDaN1wATBHyZ0Fymurw1Js01F9nv6xgff42NfOmTrdXT1A.i', 'Firstname', 'Lastname');
