import { KYC_STATUS } from "lib/pages/profile";
import { createContext, useState, useEffect } from "react";

export interface User {
  mobile: {
    countryCode: string;
    number: string;
  };
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    state: string;
    country: string;
  };
  KYC: {
    emailVerified: boolean;
    mobileVerified: boolean;
    service: string;
    status: string;
    history: {
      overall_status: string;
      details: any[];
      timestamp: string;
      _id: string;
    }[];
    uniqueScanReference: any[];
    numberOfAttempt: number;
    sumsubApplicantId: string;
  };
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: number;
}

interface UserContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (val: boolean, userData: any) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setIsLoggedIn: (val: boolean) => void;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoggedIn: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
  setIsLoggedIn: () => {},
});

// @ts-ignore
const UserContextProvider: React.FC<IntrinsicAttributes> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    console.log("SET USER", { user });
  }, [user]);

  const login = (val: boolean, userData: any) => {
    setIsLoggedIn(val);
    setUser(userData);
  };

  const logout = () => {
    // Do logout logic here, clear user data and set isLoggedIn to false
    setUser(null);
    setIsLoggedIn(false);
  };

  const userContextValue: UserContextValue = {
    user,
    isLoggedIn,
    login,
    logout,
    setUser,
    setIsLoggedIn,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
