/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from "react";

import { FinancialRequestStatus, MessageType, TaskBase } from "model";
import { DataGrid, GridColumns, GridSelectionModel } from "@mui/x-data-grid";

import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { AppDispatch } from "store/store";
import {
    submitFinancialRequest,
    submitTaskRequest,
} from "store/event/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addMessage } from "store/message/messageSlice";
import { useDispatch } from "react-redux";

interface TaskItemTableProps {
    canRaiseRequest?: boolean;
    canSubmitFinancialRequests?: boolean;
    items: TaskBase[];
    loading?: boolean;
    onRowsUpdated?: (updatedRows: TaskBase[]) => void;
}

const columns: GridColumns<TaskBase> = [
    { field: "subteamId", headerName: "Subteam ID", width: 130 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "eventId", headerName: "Event ID", width: 230 },
    { field: "taskId", headerName: "Task ID", width: 230 },
];

export const TaskItemTable = ({
    canSubmitFinancialRequests,
    canRaiseRequest,
    items,
    loading,
    onRowsUpdated,
}: TaskItemTableProps): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const [rows, setRows] = useState<TaskBase[]>(items);
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>(
        [],
    );
    const [reviewNote, setReviewNote] = useState<string>("");
    const [taskReviewNote, setTaskReviewNote] = useState<string>("");

    const editRowsEnabled: boolean = onRowsUpdated !== undefined;
    const submitFinancialRequestEnabled: boolean =
        canSubmitFinancialRequests !== undefined &&
        canSubmitFinancialRequests &&
        selectedRows.length > 0;

    const selectedRow: TaskBase | undefined =
        // eslint-disable-next-line multiline-ternary
        selectedRows.length > 0
            ? rows.find((r: TaskBase) => r.taskId === selectedRows[0])
            : undefined;

    const showRaiseRequest: boolean =
        canRaiseRequest !== undefined &&
        canRaiseRequest &&
        selectedRows.length > 0;

    useEffect(() => {
        setRows(items);
    }, [items]);

    const handleSelectionChanged = (
        selectionModel: GridSelectionModel,
    ): void => {
        setSelectedRows(selectionModel);
    };

    const handleSubmitFinancialRequest = (): void => {
        dispatch(
            submitFinancialRequest({
                taskId: `${selectedRows[0]}`,
                request: reviewNote,
                status: FinancialRequestStatus.SUBMITTED,
            }),
        )
            .then(unwrapResult)
            .then((res: any) => {
                console.log("financial request submitted", res);
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Financial request submitted",
                    }),
                );
                setSelectedRows([]);
                setReviewNote("");
            })
            .catch((e) => {
                console.warn(
                    "submitting financial request failed unexpectedly",
                    e,
                );
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Financial request submission failed - please try again",
                    }),
                );
            });
    };

    const handleSubmitRequest = (): void => {
        dispatch(
            submitTaskRequest({
                taskId: `${selectedRows[0]}`,
                request: taskReviewNote,
            }),
        )
            .then(unwrapResult)
            .then((res: any) => {
                console.log(res);
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Task request submitted successfully",
                    }),
                );
                setTaskReviewNote("");
                setSelectedRows([]);
            })
            .catch(() => {
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Something went wrong when submitting task request - please try again",
                    }),
                );
            });
    };

    const handleRemoveRows = (): void => {
        if (onRowsUpdated === undefined) return;
        const keepRows: TaskBase[] = rows.filter(
            (r: TaskBase) => !selectedRows.includes(r.taskId),
        );
        onRowsUpdated(keepRows);
        setSelectedRows([]);
    };

    const handleGetRowId = (task: TaskBase): number | string => task.taskId;

    return (
        <div style={{ width: "100%" }}>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    getRowId={handleGetRowId}
                    columns={columns}
                    pageSize={5}
                    loading={loading}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={editRowsEnabled}
                    onSelectionModelChange={handleSelectionChanged}
                />
            </div>
            {submitFinancialRequestEnabled && (
                <div>
                    <Typography variant="h4">
                        Submit a financial request
                    </Typography>
                    <FormControl style={{ width: "30ch", marginRight: 10 }}>
                        <InputLabel htmlFor={"request-note-input"}>
                            Request note
                        </InputLabel>
                        <OutlinedInput
                            id="request-note-input"
                            value={reviewNote ?? ""}
                            label="Request note"
                            onChange={(e) => setReviewNote(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        color="warning"
                        variant="contained"
                        disabled={loading}
                        onClick={handleSubmitFinancialRequest}
                    >
                        Submit
                    </Button>
                </div>
            )}
            {selectedRow !== undefined && selectedRow.comment?.length > 0 && (
                <div>
                    <Typography variant="body1">
                        Existing task request: {selectedRow.comment}
                    </Typography>
                </div>
            )}
            {showRaiseRequest && (
                <div style={{ marginTop: 20 }}>
                    <FormControl style={{ width: "30ch" }}>
                        <InputLabel htmlFor={"raise-request-input"}>
                            Raise request
                        </InputLabel>
                        <OutlinedInput
                            id="raise-request-input"
                            value={taskReviewNote ?? ""}
                            label="Raise request"
                            onChange={(e) => setTaskReviewNote(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        disabled={loading}
                        color="warning"
                        variant="contained"
                        onClick={handleSubmitRequest}
                    >
                        Submit request
                    </Button>
                </div>
            )}
            {onRowsUpdated !== undefined && selectedRows.length > 0 && (
                <Button
                    color="warning"
                    variant="contained"
                    onClick={handleRemoveRows}
                >
                    Remove selected rows
                </Button>
            )}
        </div>
    );
};
