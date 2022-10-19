DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS event;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS hr;

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
INSERT INTO user (username, password, role) VALUES ('PM', 'PM', 'PRODUCTION_DEPARTMENT_MANAGER');
INSERT INTO user (username, password, role) VALUES ('SM', 'SM', 'SERVICE_DEPARTMENT_MANAGER');


CREATE TABLE event (
  id TEXT PRIMARY KEY UNIQUE,
  clientId TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  reviewNotes TEXT,
  eventRequestItems TEXT,
  status TEXT NOT NULL DEFAULT "NEW"
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  subteamId TEXT NOT NULL,
  description TEXT,
  eventId TEXT NOT NULL,
  comment TEXT,
  FOREIGN KEY(eventId) REFERENCES event(id)
);

CREATE TABLE hr (
  id TEXT PRIMARY KEY,
  subteamId TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT
);
