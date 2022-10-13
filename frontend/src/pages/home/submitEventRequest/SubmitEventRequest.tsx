import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { EventRequestItemTable } from "components/events/EventRequestItemTable";
import { isValid } from "date-fns";
import { createDefaultEvent } from "logic/event";
import { EventBase, EventRequestItem, LoadingState, MessageType } from "model";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";

import AddIcon from "@mui/icons-material/Add";
import { AppDispatch, RootState } from "store/store";
import { LoadingButton } from "@mui/lab";
import { createEvent } from "store/event/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";

type EventValidation = {
    [key in keyof EventBase]: boolean;
};

export const SubmitEventRequest = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const creatingState: LoadingState = useSelector(
        (state: RootState) => state.event.creating,
    );

    const [newEvent, setNewEvent] = useState<EventBase>(createDefaultEvent());
    const [validationState, setValidationState] =
        useState<EventValidation | null>(null);

    const [requestItemDescription, setRequestItemDescription] =
        useState<string>("");

    const canSubmitRequestItem: boolean = requestItemDescription.length > 0;
    const loading: boolean = creatingState === LoadingState.PENDING;

    const changeValue = (key: keyof EventBase, value: any): void =>
        setNewEvent({ ...newEvent, [key]: value });
    const onChange = (key: keyof EventBase) => (e: any) =>
        changeValue(key, e.target.value);

    const hasError = (key: keyof EventBase): boolean =>
        validationState !== null && !!validationState[key];

    const handleSubmitRequestItem = (): void => {
        if (newEvent.eventRequestItems.length === 0) {
            const first: EventRequestItem = {
                requestId: 1,
                description: requestItemDescription,
            };
            changeValue("eventRequestItems", [first]);
            setRequestItemDescription("");
            return;
        }

        const max: number = Math.max(
            ...newEvent.eventRequestItems.map((e) => e.requestId),
        );
        const next: EventRequestItem = {
            requestId: max + 1,
            description: requestItemDescription,
        };
        const updatedItems: EventRequestItem[] = [
            next,
            ...newEvent.eventRequestItems,
        ];
        changeValue("eventRequestItems", updatedItems);
        setRequestItemDescription("");
    };

    const handleSubmit = (): void => {
        const fromDate = new Date(newEvent.startDate);
        const toDate = new Date(newEvent.endDate);

        const fromValid = isValid(fromDate);
        const toValid = isValid(toDate);

        const validation: EventValidation = {
            startDate: !fromValid,
            endDate: !toValid,
            clientId: newEvent.clientId.length === 0,
            eventRequestItems: newEvent.eventRequestItems.length === 0,
        };

        setValidationState(validation);

        for (const validationEntry of Object.entries(validation)) {
            // if validation failed for some input, don't process submit
            if (validationEntry[1]) {
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Invalud input received - make sure you provided the correct values.",
                    }),
                );
                return;
            }
        }
        dispatch(createEvent(newEvent))
            .then(unwrapResult)
            .then(() => {
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Event successfully created!",
                    }),
                );
                setNewEvent(createDefaultEvent());
            })
            .catch((e) => {
                console.warn("Creating event failed unexpectedly", e);
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Event creation failed unexpectedly, please try again",
                    }),
                );
            });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <div>
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
                    <Typography variant="h3">New Event Request</Typography>
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <FormControl style={styles.inputField}>
                            <InputLabel htmlFor={"client-input"}>
                                Client ID
                            </InputLabel>
                            <OutlinedInput
                                id="client-input"
                                value={newEvent.clientId}
                                error={hasError("clientId")}
                                label="Client ID"
                                onChange={onChange("clientId")}
                            />
                        </FormControl>
                        <FormControl style={styles.inputField}>
                            <InputLabel htmlFor={"start-input"}>
                                Start date
                            </InputLabel>
                            <OutlinedInput
                                id="start-input"
                                label="Start date"
                                error={hasError("startDate")}
                                value={newEvent.startDate}
                                onChange={onChange("startDate")}
                            />
                        </FormControl>
                        <FormControl style={styles.inputField}>
                            <InputLabel htmlFor={"end-input"}>
                                End date
                            </InputLabel>
                            <OutlinedInput
                                id="end-input"
                                label="End date"
                                error={hasError("endDate")}
                                value={newEvent.endDate}
                                onChange={onChange("endDate")}
                            />
                        </FormControl>
                        <Typography variant="h4" style={{ marginTop: 10 }}>
                            Add new event request item
                        </Typography>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                            }}
                        >
                            <FormControl style={{ flex: 1, marginTop: 10 }}>
                                <InputLabel htmlFor={"description-input"}>
                                    Description
                                </InputLabel>
                                <OutlinedInput
                                    id="description-input"
                                    label="description"
                                    error={hasError("eventRequestItems")}
                                    value={requestItemDescription}
                                    onChange={(e: any) =>
                                        setRequestItemDescription(
                                            e.target.value,
                                        )
                                    }
                                />
                            </FormControl>
                            <div style={{ marginLeft: 10 }}>
                                <IconButton
                                    disabled={!canSubmitRequestItem}
                                    size="small"
                                    onClick={handleSubmitRequestItem}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <EventRequestItemTable
                                items={newEvent.eventRequestItems}
                                onRowsUpdated={(rows: EventRequestItem[]) =>
                                    changeValue("eventRequestItems", rows)
                                }
                            />
                        </div>
                        <div>
                            <LoadingButton
                                loading={loading}
                                variant="contained"
                                onClick={handleSubmit}
                            >
                                Submit
                            </LoadingButton>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    inputField: {
        marginTop: 15,
    },
};
