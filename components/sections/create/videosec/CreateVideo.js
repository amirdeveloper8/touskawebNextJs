import classes from "../create.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import axios from "axios";
import NewRich from "../../../richtexteditor/NewRich";

const isText = (value) => value.trim().length > 0;

const CreateVideo = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: subValue,
    isValid: subIsValid,
    hasError: subHasError,
    valueChangeHandler: subChangeHandler,
    inputBlurHandler: subBlurHandler,
    reset: resetSub,
  } = useInput(isText);

  const {
    value: srcValue,
    isValid: srcIsValid,
    hasError: srcHasError,
    valueChangeHandler: srcChangeHandler,
    inputBlurHandler: srcBlurHandler,
    reset: resetSrc,
  } = useInput(isText);

  let formIsValid = false;

  if (titleIsValid && srcIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("create/section/video");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("page_id", props.pageId);
    fData.append("title", titleValue);
    fData.append("subtitle", subValue);
    fData.append("src", srcValue);

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        if (res.data.status === "success created") {
          setNotification(res.data.status);

          setTimeout(() => {
            authCtx.closePageHandler();
            props.getData();
          }, 2000);
          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeBannerSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
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

  if (notification === "success created") {
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
    <section className={classes.auth}>
      <h1>Add Video Section</h1>
      <Form onSubmit={submitHandler}>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={titleValue}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Subtitle*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={subValue}
              as="textarea"
              rows={4}
              onChange={subChangeHandler}
              onBlur={subBlurHandler}
            />

            {subHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Src*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={srcValue}
              onChange={srcChangeHandler}
              onBlur={srcBlurHandler}
            />

            {srcHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Src.
              </Alert>
            )}
          </Form.Group>
        </Row>
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
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

export default CreateVideo;
