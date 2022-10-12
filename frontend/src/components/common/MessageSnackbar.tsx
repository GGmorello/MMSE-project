import React, { useEffect, useState } from "react";

import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { Message, MessageType } from "model";
import { setMessages } from "store/message/messageSlice";

export const MessageSnackbar = (): JSX.Element => {
    const dispatch = useDispatch();
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

    const showSnackbar: boolean = currentMessage !== null;
    const messageSeverity: AlertColor | undefined = (() => {
        if (currentMessage === null) return;

        switch (currentMessage.type) {
            case MessageType.INFO:
                return "success";
            case MessageType.ERROR:
                return "error";
            case MessageType.SUCCESS:
                return "success";
            default:
                console.warn(
                    "Unexpected message type received: ",
                    currentMessage.type,
                );
                return "success";
        }
    })();

    const messages: Message[] = useSelector(
        (state: RootState) => state.message.messages,
    );

    useEffect(() => {
        if (messages.length === 0) {
            setCurrentMessage(null);
            return;
        };
        setCurrentMessage(messages[0]);
    }, [messages]);

    const handleClose = (): void => {
        // this will cause the useEffect hook to be triggered,
        // which will display the next message in queue
        const updated = messages.slice(1);
        dispatch(setMessages(updated));
    };

    return (
        <Snackbar
            key={"message-snackbar"}
            autoHideDuration={6000}
            open={showSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            onClose={handleClose}
        >
            <Alert hidden={!showSnackbar} onClose={handleClose} severity={messageSeverity}>
                {currentMessage?.message}
            </Alert>
        </Snackbar>
    );
};
