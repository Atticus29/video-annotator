import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import router from "next/router";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import Login from "./login";
import { Backdrop, CircularProgress } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { user, loading } = useFirebaseAuth();
  console.log("deleteMe user is: ");
  console.log(user);
  if (user?.uid && user?.emailVerified) {
    router.push("/me");
  }
  if (user?.uid && !user?.emailVerified) {
    router.push("/email-verification");
  }
  return (
    <>
      <Head>
        <title>Video Annotator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && <Login></Login>}
    </>
  );
}
