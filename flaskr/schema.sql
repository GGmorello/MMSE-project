DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT "user" NOT NULL,
  access_token TEXT DEFAULT (RANDOM())
);

INSERT INTO user (username, password, role) VALUES ('littlemonkey123', '12345678', 'FINANCIAL_MANAGER');
INSERT INTO user (username, password, role) VALUES ('smartpanda99', '23456789', 'CUSTOMER_SERVICE');
INSERT INTO user (username, password, role) VALUES ('tallkangaroo56', '34567890', 'CLIENT');
INSERT INTO user (username, password, role) VALUES ('sweeteagle04', '45678901', 'SENIOR_CUSTOMER_SERVICE_OFFICER');
