import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/layout/Layout";
import Head from "next/head";
import { AuthContextProvider } from "../store/auth-context";
import { useEffect, useState } from "react";
import { getData } from "../lib/get-data";

function MyApp({ Component, pageProps }) {
  const [menuList, setMenuList] = useState();
  const [menuButton, setMenuButton] = useState();
  const [menuLogo, setMenuLogo] = useState();

  const [footerDetails, setFooterDetails] = useState();
  useEffect(() => {
    const getFooterData = async () => {
      const details = await getData("get/footer");
      setFooterDetails(details);
    };
    return getFooterData;
  }, []);

  return (
    <AuthContextProvider>
      <Layout
        list={menuList}
        btn={menuButton}
        logo={menuLogo}
        footer={footerDetails}
      >
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/images/logo.png" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
}

export default MyApp;
