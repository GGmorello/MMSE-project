import React, { useEffect, useState } from "react";

import { MessageType, TaskBase } from "model";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { AppDispatch } from "store/store";
import { submitTaskRequest } from "store/event/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addMessage } from "store/message/messageSlice";
import { useDispatch } from "react-redux";

interface TaskItemTableProps {
    canRaiseRequest?: boolean;
    items: TaskBase[];
    loading?: boolean;
    onRowsUpdated?: (updatedRows: TaskBase[]) => void;
}

const columns: Array<{
    field: keyof TaskBase;
    headerName: string;
    width: number;
}> = [
    { field: "subteamId", headerName: "Subteam ID", width: 130 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "eventId", headerName: "Event ID", width: 230 },
    { field: "taskId", headerName: "Task ID", width: 230 },
];

export const TaskItemTable = ({
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
    const [taskReviewNote, setTaskReviewNote] = useState<string>("");

    const selectedRow: TaskBase | undefined =
        // eslint-disable-next-line multiline-ternary
        selectedRows.length > 0
            // eslint-disable-next-line multiline-ternary
            ? rows.find((r: TaskBase) => r.taskId === selectedRows[0])
            : undefined;
    const editRowsEnabled: boolean = onRowsUpdated !== undefined;
    const showRaiseRequest: boolean =
        canRaiseRequest !== undefined &&
        canRaiseRequest &&
        selectedRows.length > 0;

    useEffect(() => {
        setRows(items);
    }, [items]);

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

    const handleSelectionChanged = (
        selectionModel: GridSelectionModel,
    ): void => {
        setSelectedRows(selectionModel);
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
            {selectedRow !== undefined && selectedRow.comment?.length > 0 && (
                <div>
                    <Typography variant="body1">Existing task request: {selectedRow.comment}</Typography>
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
