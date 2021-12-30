import classes from "../add.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const AddSampleWorks = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgProjects, setImgProjects] = useState(null);

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
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: titleProjectValue,
    isValid: titleProjectIsValid,
    hasError: titleProjectHasError,
    valueChangeHandler: titleProjectChangeHandler,
    inputBlurHandler: titleProjectBlurHandler,
    reset: resetTitleProject,
  } = useInput(isText);

  const {
    value: nameProjectValue,
    isValid: nameProjectIsValid,
    hasError: nameProjectHasError,
    valueChangeHandler: nameProjectChangeHandler,
    inputBlurHandler: nameProjectBlurHandler,
    reset: resetNameProject,
  } = useInput(isText);

  const {
    value: buttonNameValue,
    isValid: buttonNameIsValid,
    hasError: buttonNameHasError,
    valueChangeHandler: buttonNameChangeHandler,
    inputBlurHandler: buttonNameBlurHandler,
    reset: resetButtonName,
  } = useInput(isText);

  const {
    value: buttonUrlValue,
    isValid: buttonUrlIsValid,
    hasError: buttonUrlHasError,
    valueChangeHandler: buttonUrlChangeHandler,
    inputBlurHandler: buttonUrlBlurHandler,
    reset: resetButtonUrl,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const imgProjectHandle = (file) => {
    setImgProjects(file[0]);
  };

  let formIsValid = false;

  if (
    titleIsValid &&
    titleProjectIsValid &&
    nameProjectIsValid &&
    buttonUrlIsValid &&
    buttonNameIsValid &&
    imgProjects &&
    selectedFile
  ) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    fData.append("section_id", props.secId);
    fData.append("title_box", titleValue);
    fData.append("image_box", selectedFile);
    fData.append("title_project", titleProjectValue);
    fData.append("name_project", nameProjectValue);
    fData.append("button_project_name", buttonNameValue);
    fData.append("button_project_url", buttonUrlValue);
    fData.append("url_project", buttonUrlValue);
    fData.append("image_project", imgProjects);

    const connectDB = ConnectToDB("create/box/portfolioContent");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status === "success created") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 2800);

          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeSimpleSection();
          }, 3000);
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
      <h2>Add New Item</h2>
      <Form onSubmit={submitHandler}>
        <Row className={`mb-3 ${classes.control}`}>
          <h3>Box Items</h3>
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
          <Form.Group className="mb-3">
            <Form.Label>Image*</Form.Label>
            <Form.Control
              name="image"
              lg={12}
              id="image"
              type="file"
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
          </Form.Group>
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          <h3>Project Items</h3>
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
              value={titleProjectValue}
              onChange={titleProjectChangeHandler}
              onBlur={titleProjectBlurHandler}
            />

            {titleProjectHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={nameProjectValue}
              onChange={nameProjectChangeHandler}
              onBlur={nameProjectBlurHandler}
            />

            {nameProjectHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>button name*</Form.Label>
            <Form.Control
              placeholder="button name"
              required
              value={buttonNameValue}
              onChange={buttonNameChangeHandler}
              onBlur={buttonNameBlurHandler}
            />

            {buttonNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid button name.
              </Alert>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Url*</Form.Label>
            <Form.Control
              placeholder="button url"
              required
              value={buttonUrlValue}
              onChange={buttonUrlChangeHandler}
              onBlur={buttonUrlBlurHandler}
            />

            {buttonUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid button url.
              </Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image*</Form.Label>
            <Form.Control
              lg={12}
              name="image"
              id="image"
              type="file"
              onChange={(e) => imgProjectHandle(e.target.files)}
              size="sm"
            />
          </Form.Group>
        </Row>

        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Save
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

export default AddSampleWorks;
