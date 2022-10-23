import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    OutlinedInput,
    Typography,
} from "@mui/material";
import {
    LoadingState,
    MessageType,
    TaskApplication,
    TaskApplicationBase,
    TaskBase,
} from "model";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import AddIcon from "@mui/icons-material/Add";
import { LoadingButton } from "@mui/lab";
import { createDefaultTask, createDefaultTaskApplication } from "logic/event";
import { addMessage } from "store/message/messageSlice";
import { createTaskApplication } from "store/event/eventSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { TaskItemTable } from "components/events/TaskItemTable";

export const SubmitTaskApplication = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const loadingState: LoadingState = useSelector(
        (state: RootState) => state.event.loading,
    );

    const [taskApplication, setTaskApplication] = useState<TaskApplicationBase>(
        createDefaultTaskApplication(),
    );
    const [newTask, setNewTask] = useState<TaskBase>(createDefaultTask());

    const canSubmitTaskApplication: boolean =
        taskApplication.eventId.length > 0 && taskApplication.tasks.length > 0;
    const canSubmitTask: boolean =
        newTask.description.length > 0 && newTask.subteamId.length > 0;

    const loading: boolean = loadingState === LoadingState.PENDING;

    const changeApplicationValue = (
        key: keyof TaskApplicationBase,
        value: any,
    ): void => setTaskApplication({ ...taskApplication, [key]: value });

    const onApplicationChange = (key: keyof TaskApplicationBase) => (e: any) =>
        changeApplicationValue(key, e.target.value);

    const changeTaskVAlue = (key: keyof TaskBase, value: any): void =>
        setNewTask({ ...newTask, [key]: value });

    const onTaskChange = (key: keyof TaskBase) => (e: any) =>
        changeTaskVAlue(key, e.target.value);

    const handleSubmitTaskApplication = (): void => {
        dispatch(createTaskApplication(taskApplication))
            .then(unwrapResult)
            .then(() => {
                setNewTask(createDefaultTask());
                setTaskApplication(createDefaultTaskApplication());
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Task application submitted succesfully",
                    }),
                );
            })
            .catch((e) => {
                console.error("task application creation error", e);
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "Task application failed unexpectedly, please try again",
                    }),
                );
            });
    };

    const handleSubmitSubteamTask = (): void => {
        if (taskApplication.tasks.length === 0) {
            const first: TaskBase = {
                ...newTask,
                taskId: 1,
            };
            changeApplicationValue("tasks", [first]);
            setNewTask(createDefaultTask());
            return;
        }

        const max: number = Math.max(
            ...taskApplication.tasks.map((e) => Number(e.taskId)),
        );
        const next: TaskBase = {
            ...newTask,
            taskId: max + 1,
        };
        const updatedItems: TaskBase[] = [next, ...taskApplication.tasks];
        changeApplicationValue("tasks", updatedItems);
        setNewTask(createDefaultTask());
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <div style={{ width: 800 }}>
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
                    <Typography variant="h3">New Task Application</Typography>
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <FormControl style={styles.inputField}>
                            <InputLabel htmlFor={"event-input"}>
                                Event ID
                            </InputLabel>
                            <OutlinedInput
                                id="event-input"
                                value={taskApplication.eventId}
                                // error={hasError("clientId")}
                                label="Event ID"
                                onChange={onApplicationChange("eventId")}
                            />
                        </FormControl>
                        <Typography variant="h4" style={{ marginTop: 10 }}>
                            Add a new task
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
                                <InputLabel htmlFor={"subteam-input"}>
                                    Subteam ID
                                </InputLabel>
                                <OutlinedInput
                                    id="subteam-input"
                                    label="Subteam ID"
                                    value={newTask.subteamId}
                                    onChange={onTaskChange("subteamId")}
                                />
                            </FormControl>
                            <FormControl style={{ flex: 1, marginTop: 10 }}>
                                <InputLabel htmlFor={"description-input"}>
                                    Description
                                </InputLabel>
                                <OutlinedInput
                                    id="description-input"
                                    label="description"
                                    value={newTask.description}
                                    onChange={onTaskChange("description")}
                                />
                            </FormControl>
                            <div style={{ marginLeft: 10 }}>
                                <IconButton
                                    disabled={!canSubmitTask}
                                    size="small"
                                    onClick={handleSubmitSubteamTask}
                                >
                                    <AddIcon />
                                </IconButton>
                            </div>
                        </div>
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <TaskItemTable
                                items={taskApplication.tasks}
                                onRowsUpdated={(rows: TaskBase[]) => {
                                    changeApplicationValue("tasks", rows);
                                }}
                            />
                        </div>
                        <div>
                            <LoadingButton
                                loading={loading}
                                disabled={!canSubmitTaskApplication}
                                variant="contained"
                                onClick={handleSubmitTaskApplication}
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
