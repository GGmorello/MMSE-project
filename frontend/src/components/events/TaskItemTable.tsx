import React, { useEffect, useState } from "react";

import { EventRequestItem, TaskBase } from "model";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import { Button } from "@mui/material";

interface EventRequestItemTableProps {
    items: TaskBase[];
    onRowsUpdated?: (updatedRows: TaskBase[]) => void;
}

const columns: Array<{
    field: keyof TaskBase;
    headerName: string;
    width: number;
}> = [
    { field: "subteamId", headerName: "Subteam ID", width: 130 },
    { field: "description", headerName: "Description", width: 230 },
];

export const TaskItemTable = ({
    items,
    onRowsUpdated,
}: EventRequestItemTableProps): JSX.Element => {
    const [rows, setRows] = useState<TaskBase[]>(items);
    const [selectedRows, setSelectedRows] = useState<Array<string | number>>(
        [],
    );

    const editRowsEnabled: boolean = onRowsUpdated !== undefined;

    useEffect(() => {
        setRows(items);
    }, [items]);

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

    const handleGetRowId = (event: TaskBase): number => event.taskId;

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
