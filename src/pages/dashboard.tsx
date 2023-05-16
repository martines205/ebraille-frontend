import { LoadingPage } from "components/Loading";
import Navbar from "components/navbar";
import { useAuth } from "context/authContext";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { apiFetcher } from "./_app";
import { createClient } from "redis";
import Head from "next/head";
import React, { useState, createContext, useContext } from "react";
import { ListBook } from "components/listBook";
import UpdateBooks from "components/updateBookComponent";
import { RemoveBook } from "components/RemoveBook";
import { AddBook } from "components/AddBook";
import { BookContextProvider } from "context/BooksContext";
import EditRole from "components/EditRole";

interface ContextType {
  mode: number;
}
type IModeContext = [React.Dispatch<React.SetStateAction<ContextType>>];
export const ModeContext = createContext<IModeContext>([() => null]);

export default function Index({ role, username }: any) {
  const route = useRouter();
  const { authenticated, loadingPage } = useAuth();
  const [mode, setMode] = useState<ContextType>({ mode: 0 });
  useEffect(() => {
    console.log("mode: ", mode);
    const onMode = mode.mode;
    switch (onMode) {
      case 1:
        route.replace({ pathname: "/dashboard" }, "/dashboard/AddBook", { shallow: true });
        break;
      case 2:
        route.replace({ pathname: "/dashboard" }, "/dashboard/editBook", { shallow: true });
        break;
      case 3:
        route.replace({ pathname: "/dashboard" }, "/dashboard/removeBook", { shallow: true });
        break;
      case 4:
        break;
      default:
        route.replace({ pathname: "/dashboard" }, "/dashboard", { shallow: true });
        break;
    }
  }, [mode]);

  type MyComponentProps = {
    modeState: ContextType;
  };
  const modeSelector: React.FC<MyComponentProps> = ({ modeState }) => {
    const onMode = mode.mode;
    switch (onMode) {
      case 1:
        return <AddBook role={role} />;
      case 2:
        return (
          <BookContextProvider>
            <UpdateBooks />;
          </BookContextProvider>
        );
      case 3:
        return (
          <BookContextProvider>
            <RemoveBook />;
          </BookContextProvider>
        );
      case 4:
        return <EditRole />;
      default:
        return (
          <BookContextProvider>
            <ListBook />;
          </BookContextProvider>
        );
    }
  };

  useEffect(() => {
    if (!authenticated) route.push("/");
  }, [authenticated, loadingPage, route]);
  if (!authenticated || loadingPage || role === undefined) return <LoadingPage />;

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen relative">
        <ModeContext.Provider value={[setMode]}>
          <Navbar role={role} username={username} />
        </ModeContext.Provider>
        <div className="h-full w-full flex justify-center items-center ">{modeSelector({ modeState: mode })}</div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  const { accessToken, refreshToken, username } = context.query;
  if (accessToken === undefined || refreshToken === undefined) return { redirect: { destination: "/", permanent: true } };
  if (accessToken === "" || refreshToken === "") return { redirect: { destination: "/", permanent: true } };
  // console.log("accessToken, refreshToken: ", accessToken, refreshToken);
  try {
    if (typeof refreshToken === "string") {
      const value = await client.get(refreshToken);
      if (value !== null) {
        // console.log("Found in cache!");
        return {
          props: {
            role: value,
            username,
          },
        };
      }
    }

    const response = await apiFetcher.get("/role/getRole", { params: { accessToken, refreshToken } });
    if (typeof refreshToken === "string") {
      await client.set(refreshToken, response.data.role, { EX: 60 * 5 });
      console.log("cached!!!");
    }
    // console.log("response: ", response.data);
    return {
      props: {
        role: response.data.role,
        username,
      },
    };
  } catch (error: any) {
    await client.DEL(refreshToken);
    await client.disconnect();

    console.log("Error: ", error.config.baseURL);
    console.log("Error: ", error.config.baseURL);
    return { redirect: { destination: "/?status=false", permanent: false } };
  }
};
