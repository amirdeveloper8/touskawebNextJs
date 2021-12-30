import { Fragment, useContext } from "react";
import AuthContext from "../../store/auth-context";
import MainNavigation from "./MainNavigation";
import Sidebar from "./Sidebar";

import classes from "./layout.module.css";
import { useRouter } from "next/router";
import Footer from "./Footer";

const Layout = (props) => {
  const router = useRouter();
  const pathName = router.asPath.includes("dashboard");

  const authCtx = useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;

  return (
    <Fragment>
      <MainNavigation list={props.list} btn={props.btn} logo={props.logo} />
      {isLoggedIn && pathName && <Sidebar />}
      <main className={classes.main}>{props.children}</main>
      <Footer details={props.footer} />
    </Fragment>
  );
};

export default Layout;
