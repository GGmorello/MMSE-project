import { Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Event, MessageType } from "model";
import { fetchEvents } from "store/event/eventSlice";
import { AppDispatch, RootState } from "store/store";
import { EventRequestTable } from "components/events/EventRequestTable";
import { addMessage } from "store/message/messageSlice";

export const BrowseEventRequests = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const events: Event[] = useSelector((state: RootState) => state.event.events);

    useEffect(() => {
        // fetch events on every component mount
        dispatch(fetchEvents(""))
            .then(unwrapResult)
            .then(() => {})
            .catch((e) => {
                console.warn("Event loading failed unexpectedly", e);
                dispatch(addMessage({
                    type: MessageType.ERROR,
                    message: "Failed to load events",
                }));
            });
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <div style={{ width: 1000 }}>
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "white",
                        borderRadius: 20,
                        paddingTop: 20,
                        paddingRight: 40,
                        paddingBottom: 20,
                        paddingLeft: 40,
                    }}
                >
                    <Typography variant="h3">Browse Event Requests</Typography>
                    <EventRequestTable items={events} />
                </div>
            </div>
        </div>
    );
};
