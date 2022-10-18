import React, { useEffect, useState } from "react";

import { HiringRequest } from "model";
import { DataGrid, GridColumns, GridSelectionModel } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { getRoleLabel } from "logic/user";

interface HiringRequestTableProps {
    canReviewHiringRequests?: boolean;
    items: HiringRequest[];
    loading?: boolean;
}

const columns: GridColumns<HiringRequest> = [
    {
        field: "submittor",
        headerName: "Submittor",
        renderCell: (params) => {
            return getRoleLabel(params.row.submittor);
        },
        width: 200,
    },
    {
        field: "requestedRole",
        headerName: "Role",
        renderCell: (params) => {
            return getRoleLabel(params.row.requestedRole);
        },
        width: 200,
    },
    { field: "comment", headerName: "Comment", width: 300 },
];

export const HiringRequestTable = ({
    canReviewHiringRequests,
    items,
    loading,
}: HiringRequestTableProps): JSX.Element => {
    const [rows, setRows] = useState<HiringRequest[]>(items);
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>(
        [],
    );

    useEffect(() => {
        setRows([...items]);
    }, [items]);

    const handleSelectionChanged = (
        selectionModel: GridSelectionModel,
    ): void => {
        setSelectedRows(selectionModel);
    };

    const handleReviewRequest = (
        id: string | number,
        approved: boolean,
    ): void => {
        console.log("review request", id, approved);
    };

    const handleGetRowId = (req: HiringRequest): string => req.id;

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
                    getRowId={handleGetRowId}
                    loading={loading}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={handleSelectionChanged}
                />
            </div>
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */}
            {selectedRows.length > 0 && !!canReviewHiringRequests && (
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
