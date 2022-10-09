import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { getRoleRoutes, getRouteLabel } from "logic/routes";
import { MessageType, Page, User } from "model";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { logoutUser } from "store/user/userSlice";
import { SubmitClientDetails } from "./submitClientDetails/SubmitClientDetails";

export const Home = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const user: User | null = useSelector(
        (state: RootState) => state.user.userData,
    );

    const [userRoutes, setUserRoutes] = useState<Page[]>([]);

    const [value, setValue] = useState<Page>(Page.HOME);

    const handleChange = (event: any, newValue: any): any => {
        setValue(newValue);
    };

    useEffect(() => {
        if (user === null) {
            setUserRoutes([]);
            return;
        }
        const userRoutes: Page[] = getRoleRoutes(user.role);
        setUserRoutes(userRoutes);
    }, [user]);

    const handleLogout = (): void => {
        dispatch(logoutUser(null))
            .then(unwrapResult)
            .then(() => {
                dispatch(
                    addMessage({
                        type: MessageType.INFO,
                        message: "Logout successful",
                    }),
                );
            })
            .catch((e) => {
                console.error("Logout failed unexpectedly", e);
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message: "Logout failed unexpectedly",
                    }),
                );
            });
    };

    const getRouteComponent = (page: Page): JSX.Element => {
        switch (page) {
            case Page.SUBMIT_CLIENT_DETAILS:
                return <SubmitClientDetails />;
            default:
                console.warn(
                    "Unexpected page received, cannot calculate correct page component",
                    page,
                );
                return (
                    <Typography variant="h3" color={"white"}>
                        Unknown page received
                    </Typography>
                );
        }
    };

    if (user === null) {
        return (
            <Typography variant="h1">
                Unexpected error, user data is null
            </Typography>
        );
    }

    console.log(userRoutes);

    return (
        <div style={{ display: "flex", flexDirection: "row", width: "60vw" }}>
            <div style={{ flex: 1 }}>
                <TabContext value={value}>
                    <Box
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <TabList
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            textColor="primary"
                            indicatorColor="primary"
                        >
                            <Tab
                                label={
                                    <Typography variant="body2" color={"white"}>
                                        Home
                                    </Typography>
                                }
                                value={Page.HOME}
                            />
                            {userRoutes.map((route: Page) => {
                                return (
                                    <Tab
                                        key={route}
                                        label={
                                            <Typography
                                                variant="body2"
                                                color={"white"}
                                            >
                                                {getRouteLabel(route)}
                                            </Typography>
                                        }
                                        value={route}
                                    />
                                );
                            })}
                        </TabList>
                    </Box>
                    <TabPanel value={Page.HOME}>
                        <Typography variant="h3" color={"white"}>
                            Welcome, Home {user.username}!
                        </Typography>
                    </TabPanel>
                    {userRoutes.map((route: Page) => {
                        return (
                            <TabPanel key={route} value={route}>
                                {getRouteComponent(route)}
                            </TabPanel>
                        );
                    })}
                </TabContext>
            </div>
            <div>
                <Button variant="contained" onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};
