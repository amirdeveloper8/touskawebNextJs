import { useContext, useEffect, useState } from "react";
import { CloseButton } from "react-bootstrap";
import Button from "../../../components/ui/Button";
import CreateFooter from "../../../components/footer/CreateFooter";
import { getData } from "../../../lib/get-data";
import AuthContext from "../../../store/auth-context";
import classes from "../../../styles/dashboard.module.css";
import UpdateFooter from "../../../components/footer/UpdateFooter";

import { AiTwotoneDelete } from "react-icons/ai";
import Notification from "../../../components/ui/notification";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios from "axios";

const Footer = (props) => {
  const [dataError, setdataError] = useState("something went wrong");
  const [notification, setNotification] = useState();

  const [footerDetails, setFooterDetails] = useState(props.data);
  const [footerSituation, setFooterSituation] = useState(props.data.footer);

  const [showComp, setShowComp] = useState(false);
  const authCtx = useContext(AuthContext);

  const showPage = authCtx.showPage;

  const login_token = authCtx.token;

  const deleteHandler = () => {
    const connectDB = ConnectToDB("delete/footer");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success deleted") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 1000);
          setTimeout(() => {
            setNotification();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
        setdataError(err.response.data.status);
      });
  };

  let notifDetails;

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (notification === "success deleted") {
    notifDetails = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    };
  }

  if (notification === "error") {
    notifDetails = {
      status: "error",
      title: "Error!",
      message: dataError,
    };
  }
  return (
    <section className="dashboard">
      {!footerSituation && showPage && (
        <div className={classes.footerDiv}>
          {!showComp && (
            <Button
              className={classes.openFooter}
              onClick={() => setShowComp(true)}
            >
              {" "}
              Create Footer{" "}
            </Button>
          )}
          {showComp && <CloseButton onClick={() => setShowComp(false)} />}
          {showComp && <CreateFooter className={classes.closeFooter} />}
        </div>
      )}
      {footerSituation && showPage && (
        <div className={classes.footerDiv}>
          {!showComp && (
            <Button
              className={classes.openFooter}
              onClick={() => setShowComp(true)}
            >
              {" "}
              Update Footer{" "}
            </Button>
          )}
          {showComp && (
            <CloseButton
              className={classes.closeFooter}
              onClick={() => setShowComp(false)}
            />
          )}
          {showComp && <UpdateFooter details={footerDetails} />}

          <AiTwotoneDelete
            className={classes.delIcon}
            onClick={deleteHandler}
          />
        </div>
      )}
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </section>
  );
};

export const getServerSideProps = async (context) => {
  const res = await fetch(`http://api.tooskaweb.com/api/get/footer`);
  const data = await res.json();

  return {
    props: {
      data,
    },
  };
};

export default Footer;
