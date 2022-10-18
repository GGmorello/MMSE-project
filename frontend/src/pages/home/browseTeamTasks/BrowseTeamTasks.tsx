import { Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { TaskItemTable } from "components/events/TaskItemTable";
import { canSubmitFinancialRequests } from "logic/user";
import { LoadingState, User } from "model";
import { MessageType } from "model/message";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "store/event/eventSlice";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";

export const BrowseTeamTasks = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const user: User | null = useSelector((state: RootState) => state.user.userData);
    const tasks = useSelector((state: RootState) => state.event.tasks);

    const loadingState: LoadingState = useSelector((state: RootState) => state.event.loading);
    const creatingState: LoadingState = useSelector((state: RootState) => state.event.creating);
    const loading = loadingState === LoadingState.PENDING || creatingState === LoadingState.PENDING;

    const submitFinancialRequestsEnabled: boolean = user !== null && canSubmitFinancialRequests(user.role);

    useEffect(() => {
        dispatch(fetchTasks(""))
            .then(unwrapResult)
            .then(() => {})
            .catch((e) => {
                console.warn("Task loading failed unexpectedly", e);
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message: "Failed to load tasks",
                    }),
                );
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
                    <Typography variant="h3">Browse Team Tasks</Typography>
                    <TaskItemTable canSubmitFinancialRequests={submitFinancialRequestsEnabled} items={tasks} loading={loading} />
                </div>
            </div>
        </div>
    );
};
