import axios from "axios";
import { useContext, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { ConnectToDB } from "../../../lib/connect-to-db";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import classes from "./delete-all.module.css";

import Modal from "../../ui/Modal";
import { Col, Row, Button } from "react-bootstrap";
const DeleteAll = (props) => {
  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState("something went wrong");

  const [reqDel, setReqDel] = useState(false);

  let url = `delete/section/${props.type}`;

  if (props.type === "slider" || props.type === "ServicesBoxes") {
    url = "delete/section/slider/all";
  }
  if (props.type === "SlideDown") {
    url = "delete/section/slidedown/all";
  }

  if (props.type === "team") {
    url = "delete/section/teams";
  }

  if (props.type === "table") {
    url = "delete/section/Table";
  }

  if (props.type === "accordion") {
    url = "delete/section/accordions";
  }

  if (props.type === "contact_us_boxes") {
    url = "delete/section/contactUsBoxes";
  }

  if (props.type === "contactForm") {
    url = "delete/section/contactform";
  }

  if (props.type === "video") {
    url = "delete/section/video";
    console.log(props.id, url);
  }

  if (props.type === "map") {
    url = "delete/section/map";
    console.log(props.id, url);
  }

  if (props.type === "blog") {
    url = "delete/section/blog";
    console.log(props.id, url);
  }

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;
  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    if (
      props.type !== "video" &&
      props.type !== "map" &&
      props.type !== "blog"
    ) {
      fData.append("id", props.id);
    }

    if (
      props.type === "video" ||
      props.type === "map" ||
      props.type === "blog"
    ) {
      fData.append("section_id", props.id);
    }

    fData.append("related_id", "*");

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status === "success deleted") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
            props.getData();
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

    console.log(fData);
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

  const deleteSecHandler = () => {
    console.log(props.id);
    console.log(props.type);
    console.log("*");
    console.log(url);
  };

  return (
    <section className={classes.deleteAll}>
      <AiTwotoneDelete onClick={() => setReqDel(true)} />
      {reqDel && (
        <Modal>
          <Row dir="ltr" className={classes.modal}>
            <Col lg={12}>
              <h4>Are you Sure ?</h4>
            </Col>
            <Col lg={6}>
              <Button variant="success" onClick={submitHandler}>
                Yes
              </Button>
            </Col>
            <Col lg={6}>
              <Button variant="danger" onClick={() => setReqDel(false)}>
                No
              </Button>
            </Col>
          </Row>
        </Modal>
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

export default DeleteAll;
