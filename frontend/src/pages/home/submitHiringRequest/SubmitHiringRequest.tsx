import { LoadingButton } from "@mui/lab";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { getDepartmentRoles, getRoleLabel } from "logic/user";
import { LoadingState, MessageType, Role, User } from "model";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { submitHiringRequest } from "store/user/userSlice";

export const SubmitHiringRequest = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const user: User | null = useSelector(
        (state: RootState) => state.user.userData,
    );

    const loadingState: LoadingState = useSelector(
        (state: RootState) => state.user.loading,
    );
    const loading: boolean = loadingState === LoadingState.PENDING;

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [hiringComment, setHiringComment] = useState<string>("");
    const [departmentRoles, setDepartmentRoles] = useState<Role[]>([]);

    const canSubmit: boolean = selectedRole !== null;

    useEffect(() => {
        if (user === null) {
            setDepartmentRoles([]);
            return;
        }
        setDepartmentRoles(getDepartmentRoles(user.role));
    }, [user]);

    const handleRoleChanged = (event: any): void => {
        setSelectedRole(event.target.value);
    };

    const handleSubmit = (): void => {
        if (selectedRole === null) return;

        dispatch(submitHiringRequest({ requestedRole: selectedRole, comment: hiringComment }))
            .then(unwrapResult)
            .then((res: any) => {
                console.log("submit hiring request", res);
                dispatch(
                    addMessage({
                        type: MessageType.SUCCESS,
                        message: "Hiring request submitted",
                    }),
                );
                setHiringComment("");
                setSelectedRole(null);
            })
            .catch((e: any) => {
                console.warn("Hiring request failed unexpectedly", e);
                dispatch(addMessage({
                    type: MessageType.ERROR,
                    message: "Submitting Hiring request failed unexpectedly",
                }));
            });
    };

    if (user === null) {
        return <div>Unexpected error, user is null</div>;
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
            }}
        >
            <div>
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
                    <Typography variant="h3">New Hiring Request</Typography>
                    <Box
                        component="form"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                        }}
                    >
                        <FormControl style={styles.inputField}>
                            <InputLabel id={"select-role-label"}>
                                Role
                            </InputLabel>
                            <Select
                                labelId="select-role-label"
                                value={selectedRole}
                                label="Role"
                                onChange={handleRoleChanged}
                            >
                                {departmentRoles.map((role: Role) => {
                                    return (
                                        <MenuItem key={role} value={role}>
                                            {getRoleLabel(role)}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl style={styles.inputField}>
                            <InputLabel htmlFor={"comment-input"}>
                                Comment
                            </InputLabel>
                            <OutlinedInput
                                id="comment-input"
                                label="Comment"
                                value={hiringComment}
                                onChange={(e) => setHiringComment(e.target.value)}
                            />
                        </FormControl>
                        <div>
                            <LoadingButton
                                disabled={!canSubmit}
                                loading={loading}
                                variant="contained"
                                onClick={handleSubmit}
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
