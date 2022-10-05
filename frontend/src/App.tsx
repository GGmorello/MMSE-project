/* eslint-disable comma-dangle */
/* eslint-disable @typescript-eslint/comma-dangle */
import React, { useState } from "react";
import "./App.css";
import { Button, TextField, Typography } from "@mui/material";

const App = (): JSX.Element => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const canLogin = username.length > 3 && password.length > 3;

  const handleUsernameChanged = (e: any): void => {
    setUsername(e.target.value);
  };

  const handlePasswordChanged = (e: any): void => {
    setPassword(e.target.value);
  };

  const handleLogin = (): void => {
    alert(username + ";" + password);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h1">Swedish Event Planners</Typography>
      </header>
      <body className="App-body">
        <div style={styles.wrapper}>
          <div>
            <Typography variant="body1">Sign in</Typography>
          </div>
          <div>
            <TextField
              label="Username"
              style={styles.textField}
              value={username}
              onChange={handleUsernameChanged}
            />
          </div>
          <div>
            <TextField
              label="Password"
              type="password"
              style={styles.textField}
              value={password}
              onChange={handlePasswordChanged}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <Button variant="contained" disabled={!canLogin} onClick={handleLogin}>
              Let&apos;s go
            </Button>
          </div>
        </div>
      </body>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  textField: {
    marginTop: 20,
    backgroundColor: "white",
  },
  wrapper: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5,
  },
};

export default App;
