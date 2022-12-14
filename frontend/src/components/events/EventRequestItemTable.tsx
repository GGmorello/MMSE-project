import React, { useEffect, useState } from "react";

import { EventRequestItem } from "model";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import { Button } from "@mui/material";

interface EventRequestItemTableProps {
    items: EventRequestItem[];
    onRowsUpdated?: (updatedRows: EventRequestItem[]) => void;
}

const columns: Array<{
    field: keyof EventRequestItem;
    headerName: string;
    width: number;
}> = [
    { field: "requestId", headerName: "ID", width: 70 },
    { field: "description", headerName: "Description", width: 230 },
];

export const EventRequestItemTable = ({
    items,
    onRowsUpdated,
}: EventRequestItemTableProps): JSX.Element => {
    const [rows, setRows] = useState<EventRequestItem[]>(items);
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>(
        [],
    );

    const editRowsEnabled: boolean = onRowsUpdated !== undefined;

    useEffect(() => {
        setRows([...items].sort((a, b) => a.requestId - b.requestId));
    }, [items]);

    const handleSelectionChanged = (
        selectionModel: GridSelectionModel,
    ): void => {
        setSelectedRows(selectionModel);
    };

    const handleRemoveRows = (): void => {
        if (onRowsUpdated === undefined) return;
        const keepRows: EventRequestItem[] = rows.filter(
            (r: EventRequestItem) => !selectedRows.includes(r.requestId),
        );
        onRowsUpdated(keepRows);
        setSelectedRows([]);
    };

    const handleGetRowId = (event: EventRequestItem): number => event.requestId;

    return (
        <div style={{ width: "100%" }}>
            <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    getRowId={handleGetRowId}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection={editRowsEnabled}
                    onSelectionModelChange={handleSelectionChanged}
                />
            </div>
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
