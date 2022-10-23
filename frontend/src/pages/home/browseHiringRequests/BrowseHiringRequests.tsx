import { Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { HiringRequestTable } from "components/user/HiringRequestTable";
import { canReviewHiringRequests } from "logic/user";
import { HiringRequest, LoadingState, MessageType, User } from "model";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { fetchHiringRequests } from "store/user/userSlice";

export const BrowseHiringRequests = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const user: User | null = useSelector((state: RootState) => state.user.userData);
    const loadingState: LoadingState = useSelector((state: RootState) => state.user.loading);
    const hiringRequests: HiringRequest[] = useSelector((state: RootState) => state.user.hiringRequests);

    const canReviewRequests: boolean = user !== null && canReviewHiringRequests(user.role);
    const loading: boolean = loadingState === LoadingState.PENDING;

    useEffect(() => {
        // fetch events on every component mount
        dispatch(fetchHiringRequests(""))
            .then(unwrapResult)
            .then(() => {})
            .catch((e) => {
                console.warn("Loading hiring requests failed unexpectedly", e);
                dispatch(addMessage({
                    type: MessageType.ERROR,
                    message: "Failed to load hiring requests",
                }));
            });
    }, []);

    if (user === null) {
        return <div>Unexpected error, couldnt load user data</div>;
    }

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
                    <Typography variant="h3">Browse Hiring Requests</Typography>
                    <HiringRequestTable canReviewHiringRequests={canReviewRequests} items={hiringRequests} loading={loading} />
                </div>
            </div>
        </div>
    );
};
