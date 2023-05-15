import Home from "lib/pages/home/Home";
import React from "react";
import type { PathRouteProps } from "react-router-dom";

const Login = React.lazy(() => import("lib/pages/login"));
const Signup = React.lazy(() => import("lib/pages/signup"));
const Profile = React.lazy(() => import("lib/pages/profile"));

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/home",
    element: <Home />,
  },
];
