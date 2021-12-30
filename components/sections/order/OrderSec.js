import axios from "axios";
import { useContext, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import AuthContext from "../../../store/auth-context";

import classes from "./order.module.css";

import { MdDoneOutline } from "react-icons/md";
import Notification from "../../ui/notification";

const OrderSec = (props) => {
  const pageId = props.pageId;
  const secId = props.data.id;
  const orderId = props.data.order;

  const [orderValue, setOrderValue] = useState(+orderId);
  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState("something went wrong");

  const changeHandler = (e) => {
    const value = e.target.value;
    setOrderValue(value);
  };

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();

    const fData = new FormData();

    const connectDB = ConnectToDB("update/section/order");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    console.log("page_id", pageId);
    console.log("section_id", secId);
    console.log("order", orderValue);

    fData.append("page_id", pageId);
    fData.append("section_id", secId);
    fData.append("order", orderValue);

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status === "success updated") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 1800);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2800);
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

  if (notification === "success updated") {
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
    <section className={classes.order}>
      <Form onSubmit={submitHandler}>
        <Row className={classes.controlFirstForm}>
          <Form.Label> order</Form.Label>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Control
              type="number"
              min={1}
              placeholder="slide Number"
              value={orderValue}
              onChange={changeHandler}
            />
          </Form.Group>
        </Row>
        <button>
          <MdDoneOutline />
        </button>
      </Form>
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

export default OrderSec;
