import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const UpdateBlog = (props) => {
  const data = props.data;
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetTitle, setResetTitle] = useState(false);
  const [resetSub, setResetSub] = useState(!data.subtitle);
  const [resetBtnName, setResetBtnName] = useState(false);
  const [resetBtnUrl, setResetBtnUrl] = useState(false);

  console.log(props.pageId);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
  } = useInput(isText);

  const {
    value: subValue,
    isValid: subIsValid,
    hasError: subHasError,
    valueChangeHandler: subChangeHandler,
    inputBlurHandler: subBlurHandler,
  } = useInput(isText);

  const {
    value: btnNameValue,
    isValid: btnNameIsValid,
    hasError: btnNameHasError,
    valueChangeHandler: btnNameChangeHandler,
    inputBlurHandler: btnNameBlurHandler,
  } = useInput(isText);

  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
  } = useInput(isText);

  let formIsValid = true;

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("update/section/blog");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("section_id", data.id);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      subValue && fData.append("subtitle", subValue);
    }

    {
      btnNameValue && fData.append("button_name", btnNameValue);
    }
    {
      btnUrlValue && fData.append("button_url", btnUrlValue);
    }
    console.log(props.pageId);
    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success updated") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 1000);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
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
    <section className={classes.auth}>
      <h1>Create Blog Section</h1>
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
              placeholder="Title"
              required
              value={resetTitle ? titleValue : data.title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && resetTitle && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetTitle && (
              <Badge
                onClick={() => setResetTitle(true)}
                className={classes.edit}
              >
                edit
              </Badge>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Subtitle</Form.Label>
            <Form.Control
              type="text"
              placeholder="Subtitle"
              as="textarea"
              value={resetSub ? subValue : data.subtitle}
              onChange={subChangeHandler}
              onBlur={subBlurHandler}
            />
            {!resetSub && (
              <Badge onClick={() => setResetSub(true)} className={classes.edit}>
                edit
              </Badge>
            )}
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
              value={
                resetBtnName ? btnNameValue : data.section_content.button.name
              }
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />
            {!resetBtnName && (
              <Badge
                onClick={() => setResetBtnName(true)}
                className={classes.edit}
              >
                edit
              </Badge>
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
              value={
                resetBtnUrl ? btnUrlValue : data.section_content.button.url
              }
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />
            {!resetBtnUrl && (
              <Badge
                onClick={() => setResetBtnUrl(true)}
                className={classes.edit}
              >
                edit
              </Badge>
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

export default UpdateBlog;
