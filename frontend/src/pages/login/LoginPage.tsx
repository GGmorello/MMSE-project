import React, { useState } from "react";
import "./Login.css";
import { FormControl, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { loginUser } from "store/user/userSlice";
import { AppDispatch, RootState } from "store/store";
import { MessageType, User } from "model";
import { addMessage } from "store/message/messageSlice";

const LoginPage = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const { loading } = useSelector((state: RootState) => state.user);

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const isLoading = loading === "pending";

    const canLogin = username.length >= 3 && password.length >= 3;

    const handleUsernameChanged = (e: any): void => {
        setUsername(e.target.value);
    };

    const handlePasswordChanged = (e: any): void => {
        setPassword(e.target.value);
    };

    const handleLogin = (): void => {
        if (!canLogin) return;
        dispatch(loginUser({ username, password }))
            .then(unwrapResult)
            .then((res: User) => {
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: `Login successful! Welcome ${res.username}`,
                    }),
                );
                console.log("login res", res);
            })
            .catch((e) => {
                console.log("login err", e);
            });
    };

    return (
        <div className="Login">
            <header className="Login-header">
                <Typography variant="h1">Swedish Event Planners</Typography>
            </header>
            <body className="Login-body">
                <div style={styles.wrapper}>
                    <div>
                        <Typography variant="body1">Sign in</Typography>
                    </div>
                    <FormControl onSubmit={handleLogin}>
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
                    </FormControl>
                    <div style={{ marginTop: 20 }}>
                        <LoadingButton
                            loading={isLoading}
                            loadingPosition="start"
                            variant="contained"
                            disabled={!canLogin}
                            style={{ width: 150 }}
                            onClick={handleLogin}
                        >
                            Let&apos;s go
                        </LoadingButton>
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

export default LoginPage;
