import React from "react";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import NotFoundPage from "pages/notFound/NotFoundPage";
import LoginPage from "pages/login/LoginPage";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { User } from "./model";
import { Home } from "pages/home/Home";

const App = (): JSX.Element => {
    const user: User | null = useSelector(
        (state: RootState) => state.user.userData,
    );
    const loggedIn = user !== null;

    if (!loggedIn) {
        return <LoginPage />;
    }

    return <RouterProvider router={router} />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
]);

export default App;
