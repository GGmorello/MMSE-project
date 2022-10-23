import { Typography } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { FinancialRequestTable } from "components/user/FinancialRequestTable";
import { canReviewFinancialRequests } from "logic/user";
import { FinancialRequest, MessageType, User } from "model";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "store/message/messageSlice";
import { AppDispatch, RootState } from "store/store";
import { fetchFinancialRequests } from "store/user/userSlice";

export const BrowseFinancialRequests = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();

    const user: User | null = useSelector((state: RootState) => state.user.userData);

    const requests: FinancialRequest[] = useSelector(
        (state: RootState) => state.user.financialRequests,
    );

    const canReview: boolean = user !== null && canReviewFinancialRequests(user.role);

    useEffect(() => {
        dispatch(fetchFinancialRequests(""))
            .then(unwrapResult)
            .then(() => {})
            .catch((e) => {
                console.warn(
                    "fetching financial requests failed unexpectedly",
                    e,
                );
                dispatch(
                    addMessage({
                        type: MessageType.ERROR,
                        message:
                            "fetching financial requests failed unexpectedly",
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
                    <Typography variant="h3">
                        Browse Financial Requests
                    </Typography>
                    <FinancialRequestTable canReviewRequests={canReview} items={requests} />
                </div>
            </div>
        </div>
    );
};
