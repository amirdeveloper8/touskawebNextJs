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

const UpdateWorkSamples = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imgProject, setImgProject] = useState(null);

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTitleProjectValue, setResetTitleProjectValue] = useState(false);
  const [resetNameProjectValue, setResetNameProjectValue] = useState(false);
  const [resetImageProjectValue, setResetImageProjectValue] = useState(false);
  const [resetBtnNameValue, setResetBtnNameValue] = useState(false);
  const [resetBtnUrlValue, setResetBtnUrlValue] = useState(false);
  const [resetImageValue, setResetImageValue] = useState(false);

  const data = props.updateData;

  const typeName = props.sec.type.name;
  const sectionId = data.id;

  let url = "update/portfolioContent";
  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success updated" || notification === "error") {
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

  const resetTitleProjectHandler = () => {
    setResetTitleProjectValue(true);
  };

  const resetNameProjectHandler = () => {
    setResetNameProjectValue(true);
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

  const resetImageProjectHandler = () => {
    setResetImageProjectValue(true);
  };

  let updateIsValid = false;

  if (
    resetTitleValue ||
    resetBtnNameValue ||
    resetBtnUrlValue ||
    resetTitleProjectValue ||
    resetNameProjectValue ||
    resetImageProjectValue ||
    resetImageValue
  ) {
    updateIsValid = true;
  }

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const imageProjectHanler = (file) => {
    setImgProject(file[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, btnNameValue, btnUrlValue, selectedFile, sectionId);

    fData.append("project_id", sectionId);
    // fData.append("related_id", relId);
    {
      titleValue && fData.append("title_box", titleValue);
    }
    {
      selectedFile && fData.append("image_box", selectedFile);
    }
    {
      titleProjectValue && fData.append("title_project", titleProjectValue);
    }
    {
      nameProjectValue && fData.append("name_project", nameProjectValue);
    }
    {
      btnUrlValue && fData.append("url_project", btnUrlValue);
    }
    {
      btnUrlValue && fData.append("button_url", btnUrlValue);
    }
    {
      btnNameValue && fData.append("button_name", btnNameValue);
    }
    {
      imgProject && fData.append("image_project", imgProject);
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
          }, 2800);

          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeSimpleSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
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
        <h3>Box Items:</h3>
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
              value={resetTitleValue ? titleValue : data.title_box}
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

          {!resetImageValue && (
            <div className={classes.updateImage}>
              <Image
                alt="sample2-img"
                width={450}
                height={400}
                src={data.image_box_url}
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

        <Row className={`mb-3 ${classes.control}`}>
          <h3>Project Items :</h3>
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
              value={
                resetTitleProjectValue ? titleProjectValue : data.title_project
              }
              onChange={titleProjectChangeHandler}
              onBlur={titleProjectBlurHandler}
            />

            {titleProjectHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetTitleProjectValue && (
              <Badge
                className={classes.edit}
                onClick={resetTitleProjectHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Name*</Form.Label>
            <Form.Control
              placeholder="Name"
              required
              value={
                resetNameProjectValue ? nameProjectValue : data.name_project
              }
              onChange={nameProjectChangeHandler}
              onBlur={nameProjectBlurHandler}
            />

            {nameProjectHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetNameProjectValue && (
              <Badge
                className={classes.edit}
                onClick={resetNameProjectHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button Name*</Form.Label>
            <Form.Control
              placeholder="Button Name"
              required
              value={resetBtnNameValue ? btnNameValue : data.buttons.name}
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
            <Form.Label>Url*</Form.Label>
            <Form.Control
              placeholder="Url"
              required
              value={resetBtnUrlValue ? btnUrlValue : data.url_project}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Url.
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
          {!resetImageProjectValue && (
            <div className={classes.updateImage}>
              <Image
                alt="sample1-img"
                width={450}
                height={400}
                src={data.image_project_url}
              />

              <Badge
                className={classes.edit}
                onClick={resetImageProjectHandler}
                bg="secondary"
              >
                edit
              </Badge>
            </div>
          )}
          {resetImageProjectValue && (
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                name="image"
                id="image"
                type="file"
                onChange={(e) => imageProjectHanler(e.target.files)}
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

export default UpdateWorkSamples;
