/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from "react";

import { MessageType, TaskBase } from "model";
import { DataGrid, GridColumns, GridSelectionModel } from "@mui/x-data-grid";
import {
    Button,
    FormControl,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { submitFinancialRequest } from "store/event/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { addMessage } from "store/message/messageSlice";

interface TaskItemTableProps {
    canSubmitFinancialRequests?: boolean;
    items: TaskBase[];
    loading?: boolean;
    onRowsUpdated?: (updatedRows: TaskBase[]) => void;
}

const columns: GridColumns<TaskBase> = [
    { field: "subteamId", headerName: "Subteam ID", width: 130 },
    { field: "description", headerName: "Description", width: 220 },
    {
        field: "taskRequest",
        headerName: "Request",
        renderCell: (params) => {
            const request = params.row.taskRequest;
            if (request !== null) {
                return request.request;
            }
            return "-";
        },
        width: 250,
    },
];

export const TaskItemTable = ({
    canSubmitFinancialRequests,
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

    const editRowsEnabled: boolean = onRowsUpdated !== undefined;
    const submitFinancialRequestEnabled: boolean =
        canSubmitFinancialRequests !== undefined &&
        canSubmitFinancialRequests &&
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
            }),
        )
            .then(unwrapResult)
            .then((res: any) => {
                console.log("financial request submitted", res);
                dispatch(addMessage({
                    type: MessageType.SUCCESS,
                    message: "Financial request submitted",
                }));
                setSelectedRows([]);
                setReviewNote("");
            })
            .catch((e) => {
                console.warn("submitting financial request failed unexpectedly", e);
                dispatch(addMessage({
                    type: MessageType.ERROR,
                    message: "Financial request submission failed - please try again",
                }));
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

    const handleGetRowId = (event: TaskBase): number => event.taskId;

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
