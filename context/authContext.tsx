import { apiFetcher } from "@/pages/_app";
import axios from "axios";
import { promises } from "dns";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { boolean } from "yup";

type Props = {
  children: ReactNode;
};

interface authContextType {
  authenticated: boolean;
  loadingPage: boolean;
  login: () => void;
  logout: () => void;
  isUserStillValid: () => Promise<boolean>;
}

const authContextDefaultValues: authContextType = {
  authenticated: false,
  loadingPage: true,
  login: () => {},
  logout: () => {},
  isUserStillValid: async () => false,
};

export function useAuth() {
  return useContext(AuthenticatedContext);
}

const AuthenticatedContext = createContext<authContextType>(authContextDefaultValues);
export function AuthProvider({ children }: Props) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loadingPage, setLoadingPage] = useState<boolean>(true);

  const login = () => {
    setAuthenticated(true);
  };

  const logout = () => {
    setAuthenticated(false);
  };

  const isUserStillValid = async () => {
    if (localStorage.getItem("_USER_INFORMATION") !== null) {
      const { username, role, expiration } = JSON.parse(localStorage.getItem("_USER_INFORMATION")!);
      if (Date.now() > expiration) {
        console.log("user information already expired");
        await requestLogout(username);
        sessionStorage.clear();
        logout();
        return false;
      }
      return true;
    } else {
      sessionStorage.clear();
      localStorage.clear();
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await getClientInformation();
        login();
      } catch (error: any) {
        console.log("error+>: ", error.message);
        logout();
      }
      setLoadingPage(false);
    })();
  }, []);

  const value = {
    loadingPage,
    authenticated,
    login,
    logout,
    isUserStillValid,
  };

  return <AuthenticatedContext.Provider value={value}>{children}</AuthenticatedContext.Provider>;
}

async function getClientInformation(): Promise<string | Error> {
  return await new Promise(async (resolve, reject): Promise<void | string | Error> => {
    try {
      if (localStorage.getItem("_USER_INFORMATION") !== null) {
        const { username, role, expiration } = JSON.parse(localStorage.getItem("_USER_INFORMATION")!);
        if (Date.now() > expiration) {
          console.log("user information already expired");
          if (sessionStorage.getItem(username) !== null) {
            await requestLogout(username);
            sessionStorage.clear();
          }
          throw new Error("user information already expired");
        }
        return resolve(role);
      } else {
        sessionStorage.clear();
        localStorage.clear();
        throw new Error("user not available");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

interface successResponseSchema {
  accessToken: string;
  refreshToken: string;
  role: string;
}

async function requestLogout(username: string): Promise<successResponseSchema> {
  return await new Promise(async (resolve, reject) => {
    try {
      const response = await apiFetcher.get("/logout", {
        params: {
          username,
        },
      });
      console.log("Logout response: ", response);
      return resolve(response.data);
    } catch (error) {
      console.log(`/logout?username=${username}`);
      // console.log("error: ", error);
      if (error instanceof axios.AxiosError) return reject({ error });
      return reject(new Error("An unexpected error occurred"));
    }
  });
}
