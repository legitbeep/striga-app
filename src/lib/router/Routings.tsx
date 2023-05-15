import { Suspense, useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import RequireAuth from "lib/components/auth/RequireAuth";
import Page404 from "lib/pages/404";

import { routes, privateRoutes } from "./routes";
import { checkLogin } from "lib/utils";
import { UserContext } from "lib/context/UserContext";

const Routings = () => {
  return (
    <Suspense>
      <Routes>
        {routes.map((routeProps) => (
          <Route {...routeProps} key={routeProps.path as string} />
        ))}
        {privateRoutes.map(({ element, ...privateRouteProps }) => (
          <Route
            element={<RequireAuth redirectTo={`/`}>{element}</RequireAuth>}
            {...privateRouteProps}
            key={`privateRoute-${privateRouteProps.path}`}
          />
        ))}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );
};

export default Routings;
