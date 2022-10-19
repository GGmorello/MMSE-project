import React, { useEffect, useState } from "react";

import {
    EventRequestItem,
    FinancialRequest,
    LoadingState,
    MessageType,
} from "model";
import { DataGrid, GridColumns, GridSelectionModel } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { getFinancialStatusLabel } from "logic/user";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { addMessage } from "store/message/messageSlice";
import {
    fetchFinancialRequests,
    updateFinancialRequestStatus,
} from "store/user/userSlice";

interface FinancialRequestTableProps {
    canReviewRequests?: boolean;
    items: FinancialRequest[];
    onRowsUpdated?: (updatedRows: FinancialRequest[]) => void;
}

const columns: GridColumns<FinancialRequest> = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "taskId", headerName: "Task ID", width: 120 },
    { field: "request", headerName: "Request", width: 120 },
    {
        field: "status",
        headerName: "Status",
        renderCell: (params) => {
            return getFinancialStatusLabel(params.row.status);
        },
        width: 120,
    },
];

export const FinancialRequestTable = ({
    canReviewRequests,
    items,
    onRowsUpdated,
}: FinancialRequestTableProps): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const [rows, setRows] = useState<FinancialRequest[]>(items);
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>(
        [],
    );

    const loadingState: LoadingState = useSelector(
        (state: RootState) => state.user.loading,
    );
    const loading: boolean = loadingState === LoadingState.PENDING;

    const editRowsEnabled: boolean = onRowsUpdated !== undefined;
    const showReviewButtons: boolean = canReviewRequests !== undefined && canReviewRequests && selectedRows.length > 0;

    useEffect(() => {
        setRows([...items]);
    }, [items]);

    const handleSelectionChanged = (
        selectionModel: GridSelectionModel,
    ): void => {
        setSelectedRows(selectionModel);
    };

    const handleGetRowId = (req: FinancialRequest): string => req.id;

    const handleReviewRequest = (
        id: string | number,
        approved: boolean,
    ): void => {
        dispatch(
            updateFinancialRequestStatus({
                id: `${id}`,
                approved,
            }),
        )
            .then(unwrapResult)
            .then(() => {
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Reviewing request was succesful",
                    }),
                );
                dispatch(fetchFinancialRequests("")).then(
                    () => {},
                    () => {},
                );
                setSelectedRows([]);
            })
            .catch((e: any) => {
                console.warn(
                    "Reviewing financial request failed unexpectedly",
                    e,
                );
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Reviewing financial request failed unexpectedly",
                    }),
                );
            });
    };

    const handleApproveRequest = (): void => {
        if (selectedRows.length === 0) return;
        handleReviewRequest(selectedRows[0], true);
    };

    const handleRejectRequest = (): void => {
        if (selectedRows.length === 0) return;
        handleReviewRequest(selectedRows[0], false);
    };

    return (
        <div style={{ width: "100%" }}>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    loading={loading}
                    getRowId={handleGetRowId}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={editRowsEnabled}
                    onSelectionModelChange={handleSelectionChanged}
                />
            </div>
            {showReviewButtons && (
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
