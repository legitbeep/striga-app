import { useEffect, useState } from "react";
import { UserContext } from "lib/context/UserContext";
import { checkLogin, isSuccess, notify } from "lib/utils";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { fetchUser } from "lib/api/user";

type PrivateRouteProps = {
  children: React.ReactNode;
  redirectTo?: string;
};

const RequireAuth = ({
  children,
  redirectTo = "/login",
}: PrivateRouteProps) => {
  // add your own authentication logic here
  const { setUser, isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  // const [isLoggedIn, setIsLoggedIn] = useState(true);

  const { login } = useContext(UserContext);

  const loggedIn = async () => {
    try {
      const res = await fetchUser();
      setUser(res);
      setIsLoggedIn(true);
    } catch (err) {
      notify("Failed to fetch user data!", "error");
    }
  };

  useEffect(() => {
    checkLogin({
      onSuccess: loggedIn,
      onError: () => {
        login(false, null);
        setIsLoggedIn(false);
      },
    });
  }, []);

  return isLoggedIn ? (
    (children as React.ReactElement)
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export default RequireAuth;
