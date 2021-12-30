import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdatePortfolio = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetBtnNameValue, setResetBtnNameValue] = useState(false);
  const [resetBtnUrlValue, setResetBtnUrlValue] = useState(false);
  const [resetImageValue, setResetImageValue] = useState(false);

  const data = props.updateData;

  const relId = data.title.related_id;
  const typeId = props.sec.type_id;
  const typeName = props.sec.type.name;
  const sectionId = props.sec.id;

  let url = "update/box/portfolio";
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

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetBtnNameHandler = () => {
    setResetBtnNameValue(true);
  };

  const resetBtnUrlHandler = () => {
    setResetBtnUrlValue(true);
  };

  const resetImageHandler = () => {
    setResetImageValue(true);
  };

  let updateIsValid = false;

  if (
    resetTitleValue ||
    resetBtnNameValue ||
    resetBtnUrlValue ||
    resetImageValue
  ) {
    updateIsValid = true;
  }

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, btnNameValue, btnUrlValue, selectedFile);

    fData.append("section_id", sectionId);
    fData.append("related_id", relId);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      btnNameValue && fData.append("name_button", btnNameValue);
    }
    {
      btnUrlValue && fData.append("url_button", btnUrlValue);
    }
    {
      selectedFile && fData.append("image", selectedFile);
    }
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
            props.getData();
          }, 2000);

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
      <h1>Update Module {typeName}</h1>

      <Form onSubmit={submitHandler}>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={resetTitleValue ? titleValue : data.title.content}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetTitleValue && (
              <Badge
                className={classes.edit}
                onClick={resetTitleHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button Name*</Form.Label>
            <Form.Control
              placeholder="Button Name"
              required
              value={resetBtnNameValue ? btnNameValue : data.button.name}
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />

            {btnNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
              </Alert>
            )}
            {!resetBtnNameValue && (
              <Badge
                className={classes.edit}
                onClick={resetBtnNameHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button Name*</Form.Label>
            <Form.Control
              placeholder="Button Name"
              required
              value={resetBtnUrlValue ? btnUrlValue : data.button.url}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
              </Alert>
            )}
            {!resetBtnUrlValue && (
              <Badge
                className={classes.edit}
                onClick={resetBtnUrlHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row className={classes.control}>
          {!resetImageValue && (
            <div className={classes.updateImage}>
              <Image
                width={400}
                height={300}
                src={data.image}
                alt="image-portfolio"
              />

              <Badge
                className={classes.edit}
                onClick={resetImageHandler}
                bg="secondary"
              >
                edit
              </Badge>
            </div>
          )}
          {resetImageValue && (
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                name="image"
                id="image"
                type="file"
                onChange={(e) => handleChange(e.target.files)}
                size="sm"
              />
            </Form.Group>
          )}
        </Row>
        <div className={classes.actions}>
          <button disabled={!updateIsValid} variant="primary" type="submit">
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

export default UpdatePortfolio;
