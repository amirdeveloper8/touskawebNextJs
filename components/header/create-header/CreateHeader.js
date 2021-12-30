import classes from "./header.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const CreateHeader = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success created" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const {
    value: btnNameValue,
    isValid: btnNameIsValid,
    hasError: btnNameHasError,
    valueChangeHandler: btnNameChangeHandler,
    inputBlurHandler: btnNameBlurHandler,
    reset: resetBtnName,
  } = useInput(isText);

  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
    reset: resetBtnUrl,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = false;

  if (btnNameIsValid && btnUrlIsValid && selectedFile) {
    formIsValid = true;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("create/header");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };
    console.log("has_menu", 1);
    console.log("image", selectedFile);
    console.log("button_name", btnNameValue);
    console.log("button_url", btnUrlValue);

    const fData = new FormData();

    fData.append("has_menu", 1);
    fData.append("image", selectedFile);
    fData.append("button_name", btnNameValue);
    fData.append("button_url", btnUrlValue);
    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success created") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err);
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
      <h1>Create Header</h1>
      <Form onSubmit={submitHandler}>
        <Row className={classes.control}>
          <Form.Group className="mb-3">
            <Form.Label>Logo*</Form.Label>
            <Form.Control
              name="image"
              id="image"
              type="file"
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
          </Form.Group>
        </Row>
        <Row className={classes.control}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button Name"
              value={btnNameValue}
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />

            {btnNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
              </Alert>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button Url</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button Url"
              value={btnUrlValue}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Url.
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

export default CreateHeader;
