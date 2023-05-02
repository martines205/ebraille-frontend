import "@/styles/globals.css";
import type { AppProps } from "next/app";
import axios from "axios";
import { AuthProvider } from "context/authContext";

// import bg from "../../asset/mountains-1412683.svg";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

const bg = "/mountains-1412683.svg";
const apiFetcher = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 2500,
  // responseType: "json",
});
// delete apiFetcher.defaults.headers;

export { bg, apiFetcher };
