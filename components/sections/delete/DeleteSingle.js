import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useContext, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { ConnectToDB } from "../../../lib/connect-to-db";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import classes from "./delete-all.module.css";

import Modal from "../../ui/Modal";
import { Col, Row, Button } from "react-bootstrap";

const DeleteSingle = (props) => {
  const [reqDel, setReqDel] = useState(false);
  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState("something went wrong");

  //   const relId = props.box.title.related_id;
  const secId = props.secId;
  const typeName = props.type;
  const typeId = props.id;

  let relId = "";
  if (
    typeName === "team" ||
    typeName === "contactForm" ||
    typeName === "contact_us_boxes"
  ) {
    relId = props.box.id;
  }

  if (typeName === "portfolioContent") {
    relId = props.box.related_id;
  }

  if (
    typeName !== "team" &&
    typeName !== "contactForm" &&
    typeName !== "contact_us_boxes" &&
    typeName !== "portfolioContent"
  ) {
    relId = props.box.title.related_id;
  }

  let url = "";

  if (typeName === "slider" || typeName === "ServicesBoxes") {
    url = "delete/section/slider/single";
  }
  if (typeName === "SlideDown") {
    url = "delete/section/slidedown/single";
  }
  if (typeName === "plans") {
    url = "delete/section/plans/single";
  }
  if (typeName === "accordion") {
    url = "delete/section/accordion";
  }
  if (typeName === "portfolio") {
    url = "delete/box/portfolio";
  }
  if (typeName === "team") {
    url = "delete/section/team";
  }
  if (typeName === "contactForm") {
    url = "delete/input/contactform";
  }
  if (typeName === "contact_us_boxes") {
    url = "delete/box/contactUsBoxes";
  }
  if (typeName === "portfolioContent") {
    url = "delete/box/portfolioContent";
  }

  const getRelHandler = () => {
    console.log("relId:", relId);
    console.log(secId);
    console.log(typeName);
    console.log(url);
    console.log(typeId);
  };

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    console.log(url);

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    if (
      typeName !== "contactForm" &&
      typeName !== "contact_us_boxes" &&
      typeName !== "team"
    ) {
      fData.append("id", secId);
      fData.append("related_id", relId);
    }

    if (typeName === "contact_us_boxes") {
      fData.append("id", secId);
      fData.append("box_id", relId);
    }

    if (typeName === "contactForm") {
      fData.append("id", secId);
      fData.append("input_id", relId);
    }

    if (typeName === "team") {
      fData.append("id", secId);
      fData.append("team_id", relId);
    }

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

  return (
    <section className={`${classes.deleteAll} ${classes.single}`}>
      <MdOutlineDeleteOutline onClick={() => setReqDel(true)} />
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

export default DeleteSingle;
