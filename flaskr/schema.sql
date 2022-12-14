DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT "user" NOT NULL,
  access_token TEXT DEFAULT (RANDOM())
);

INSERT INTO user (username, password, role) VALUES ('ADM', 'ADM', 'ADMINISTRATION_MANAGER');
INSERT INTO user (username, password, role) VALUES ('FMM', 'FMM', 'FINANCIAL_MANAGER');
INSERT INTO user (username, password, role) VALUES ('CSS', 'CSS', 'CUSTOMER_SERVICE');
INSERT INTO user (username, password, role) VALUES ('CLIENT', 'CLIENT', 'CLIENT');
INSERT INTO user (username, password, role) VALUES ('SCSO', 'SCSO', 'SENIOR_CUSTOMER_SERVICE_OFFICER');

CREATE TABLE event (
  id TEXT PRIMARY KEY UNIQUE,
  clientId TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  reviewNotes TEXT,
  eventRequestItems TEXT,
  status TEXT NOT NULL DEFAULT "NEW"
);

