import { useRouter } from "next/router";
import { useContext } from "react";
import { Nav, Button } from "react-bootstrap";
import { ConnectToDB } from "../../lib/connect-to-db";
import AuthContext from "../../store/auth-context";
import classes from "./sidebar.module.css";

const Sidebar = () => {
  const authCtx = useContext(AuthContext);
  const router = useRouter();

  const isLoggedIn = authCtx.isLoggedIn;
  const login_token = authCtx.token;

  const connectDB = ConnectToDB("logout");

  const logoutHandler = async () => {
    authCtx.logout();
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${login_token}`,
    };

    const response = await fetch(connectDB, {
      method: "POST",
      headers: headers,
    });

    router.replace("/auth/login");
  };
  return (
    <Nav className={classes.sidebar}>
      <Nav.Link href="/dashboard/addnewpage">Add New Page</Nav.Link>
      <Nav.Link href="/dashboard/index">Index</Nav.Link>
      <Nav.Link href="/dashboard/info">Info</Nav.Link>
      <Nav.Link href="/dashboard/allpages">All Pages</Nav.Link>
      <Nav.Link href="/dashboard/header">Header</Nav.Link>
      <Nav.Link href="/dashboard/footer">Footer</Nav.Link>
      <Nav.Link href="/dashboard/plans">Plans</Nav.Link>
      {isLoggedIn && (
        <Button
          className={classes.logout}
          variant="outline-danger"
          size="sm"
          onClick={logoutHandler}
        >
          خروج
        </Button>
      )}
    </Nav>
  );
};

export default Sidebar;
