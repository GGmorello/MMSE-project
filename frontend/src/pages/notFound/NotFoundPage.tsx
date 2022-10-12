import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = (): JSX.Element => {
    return (
        <div>
            <header>
                <Typography variant="h1" color={"white"}>Page Not Found =(</Typography>
            </header>
            <body>
                <Link to="/">Back home</Link>
            </body>
        </div>
    );
};

export default NotFoundPage;
