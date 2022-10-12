import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { DataGrid, GridColumns, GridValueGetterParams } from "@mui/x-data-grid";
import { unwrapResult } from "@reduxjs/toolkit";
import { getEventStatusLabel } from "logic/event";
import { canAddReviewComments, canEditEvents } from "logic/user";
import { Event, EventStatus, LoadingState, MessageType, User } from "model";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, updateEventStatus } from "store/event/eventSlice";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { EventRequestItemTable } from "./EventRequestItemTable";

interface EventRequestTableProps {
    items: Event[];
}

const columns: GridColumns<Event> = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "clientId", headerName: "Client ID", width: 100 },
    { field: "startDate", headerName: "Start date", width: 100 },
    { field: "endDate", headerName: "End date", width: 100 },
    {
        field: "eventRequestItems",
        headerName: "Items",
        valueGetter: (params) => {
            return params.row.eventRequestItems.length;
        },
    },
    {
        field: "status",
        headerName: "Status",
        width: 150,
        valueGetter: (params: GridValueGetterParams<Event>) => {
            return getEventStatusLabel(params.row.status);
        },
    },
];

export const EventRequestTable = ({
    items,
}: EventRequestTableProps): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const [selectedRow, setSelectedRow] = useState<Event | null>(null);
    const [reviewComment, setReviewComment] = useState<string | null>(null);

    const user: User | null = useSelector(
        (state: RootState) => state.user.userData,
    );
    const loadingState: LoadingState = useSelector(
        (state: RootState) => state.event.loading,
    );
    const loading: boolean = loadingState === LoadingState.PENDING;

    const handleGetRowId = (event: Event): string => event.id;
    const canEditRows: boolean = user !== null && canEditEvents(user.role);
    const canAddComments: boolean =
        user !== null && canAddReviewComments(user.role);

    const handleUpdateEvent = (id: string, status: EventStatus): void => {
        dispatch(
            updateEventStatus({
                id,
                status,
                comment: reviewComment,
            }),
        )
            .then(unwrapResult)
            .then(() => {
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Event updated successfully",
                    }),
                );
                // re-load events since this one might no longer be accessible
                dispatch(fetchEvents(""))
                    .then(console.log.bind(this))
                    .catch(console.log.bind(this));
                setSelectedRow(null);
            })
            .catch((e) => {
                console.warn("Updating event status failed unexpectedly", e);
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message: "Updating event status failed unexpectedly",
                    }),
                );
            });
    };

    const handleApproveRequest = (): void => {
        if (selectedRow === null) return;
        handleUpdateEvent(selectedRow.id, EventStatus.APPROVED_BY_SCSO);
    };

    const handleRejectRequest = (): void => {
        if (selectedRow === null) return;
        handleUpdateEvent(selectedRow.id, EventStatus.REJECTED_BY_SCSO);
    };

    if (user === null) {
        return (
            <Typography variant="h1">
                Unexpected error, user data is null
            </Typography>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    loading={loading}
                    rows={items}
                    getRowId={handleGetRowId}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={(e) => setSelectedRow(e.row)}
                />
            </div>
            {selectedRow !== null && (
                <div>
                    <Typography variant="h4">Event Requests items</Typography>
                    <div style={{ height: 400, width: "100%" }}>
                        <EventRequestItemTable
                            items={selectedRow.eventRequestItems}
                        />
                    </div>
                    {canEditRows && (
                        <div style={{ marginTop: 10 }}>
                            {canAddComments && (
                                <FormControl style={{ width: "30ch" }}>
                                    <InputLabel htmlFor={"review-input"}>
                                        Review comment
                                    </InputLabel>
                                    <OutlinedInput
                                        id="review-input"
                                        value={reviewComment ?? ""}
                                        label="Review comment"
                                        onChange={(e) =>
                                            setReviewComment(e.target.value)
                                        }
                                    />
                                </FormControl>
                            )}
                            <div>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    disabled={loading}
                                    style={styles.buttonStyle}
                                    onClick={handleRejectRequest}
                                >
                                    Reject request
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    style={styles.buttonStyle}
                                    onClick={handleApproveRequest}
                                >
                                    Approve request
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    buttonStyle: {
        marginLeft: 5,
        marginRight: 5,
    },
};
