import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { getRolePages, getPageLabel } from "logic/pages";
import { MessageType, Page, User } from "model";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { logoutUser } from "store/user/userSlice";
import { BrowseEventRequests } from "./browseEventRequests/BrowseEventRequests";
import { BrowseHiringRequests } from "./browseHiringRequests/BrowseHiringRequests";
import { BrowseFinancialRequests } from "./browseFinancialRequests/BrowseFinancialRequests";
import { SubmitEventRequest } from "./submitEventRequest/SubmitEventRequest";
import { SubmitHiringRequest } from "./submitHiringRequest/SubmitHiringRequest";

export const Home = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const user: User | null = useSelector(
        (state: RootState) => state.user.userData,
    );

    const [userRoutes, setUserRoutes] = useState<Page[]>([]);

    const [value, setValue] = useState<Page>(Page.HOME);

    const handleChange = (_event: React.SyntheticEvent, newValue: any): any => {
        setValue(newValue);
    };

    useEffect(() => {
        if (user === null) {
            setUserRoutes([]);
            return;
        }
        const userRoutes: Page[] = getRolePages(user.role);
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
            case Page.BROWSE_EVENT_REQUEST:
                return <BrowseEventRequests />;
            case Page.BROWSE_HIRING_REQUEST:
                return <BrowseHiringRequests />;
            case Page.BROWSE_FINANCIAL_REQUEST:
                return <BrowseFinancialRequests />;
            case Page.SUBMIT_EVENT_REQUEST:
                return <SubmitEventRequest />;
            case Page.SUBMIT_HIRING_REQUEST:
                return <SubmitHiringRequest />;
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

    return (
        <div style={{ width: "60vw" }}>
            <TabContext value={value}>
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "#282c34",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            borderBottom: 1,
                            borderColor: "divider",
                        }}
                    >
                        <TabList
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
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
                                                {getPageLabel(route)}
                                            </Typography>
                                        }
                                        value={route}
                                    />
                                );
                            })}
                        </TabList>
                    </Box>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ color: "lightblue" }}
                            >
                                Logged in as &quot;{user.username}&quot;
                            </Typography>
                        </div>
                        <div>
                            <Button variant="contained" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
                <div>
                    <TabPanel value={Page.HOME}>
                        <Typography variant="h3" color={"white"}>
                            Welcome, {user.username}!
                        </Typography>
                    </TabPanel>
                    {userRoutes.map((route: Page) => {
                        return (
                            <TabPanel key={route} value={route}>
                                {route === value && getRouteComponent(route)}
                            </TabPanel>
                        );
                    })}
                </div>
            </TabContext>
        </div>
    );
};
