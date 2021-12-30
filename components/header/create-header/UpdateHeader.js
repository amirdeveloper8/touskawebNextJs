import classes from "./header.module.css";
import { Form, Row, Col, Badge, Alert, Button } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import axios from "axios";

import Modal from "../../ui/Modal";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdateHeader = (props) => {
  const btnValues = props.item.button;
  const itemId = props.item.id;

  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetBtnName, setResetBtnName] = useState(false);
  const [resetBtnUrl, setResetBtnUrl] = useState(false);
  const [resetImage, setResetImage] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  //   useEffect(() => {
  //     if (notification === "success updated" || notification === "error") {
  //       const timer = setTimeout(() => {
  //         setNotification(null);
  //         setdataError(null);
  //       }, 3000);

  //       return () => clearTimeout(timer);
  //     }
  //   }, [notification]);

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

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = false;

  if (btnNameIsValid || btnUrlIsValid || selectedFile) {
    formIsValid = true;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("update/header");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };
    console.log("has_menu", 1);
    console.log("image", selectedFile);
    console.log("button_name", btnNameValue);
    console.log("button_url", btnUrlValue);

    const fData = new FormData();

    fData.append("id", props.item.id);
    fData.append("has_menu", 1);
    {
      selectedFile && fData.append("image", selectedFile);
    }
    {
      btnNameValue && fData.append("button_name", btnNameValue);
    }
    {
      (btnNameValue || btnUrlValue) && fData.append("button_id", btnValues.id);
    }
    {
      btnUrlValue && fData.append("button_url", btnUrlValue);
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
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });
  };

  const deleteHandler = () => {
    setNotification("pending");
    const fData = new FormData();

    fData.append("id", itemId);

    const connectDB = ConnectToDB("delete/header");

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
        console.log("res", res.data);
        if (res.data.status === "success deleted") {
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

  if (notification === "success updated" || "success deleted") {
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
      <h1>Update Header</h1>
      <Form onSubmit={submitHandler}>
        <Row className={classes.control}>
          {!resetImage && props.item.logo_url && (
            <div className={classes.imageLogo}>
              <Image
                width={300}
                height={230}
                alt="logo"
                src={props.item.logo_url}
              />

              <AiFillEdit
                className={classes.edit}
                onClick={() => setResetImage(true)}
              />
            </div>
          )}
          {resetImage && (
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Label>Logo*</Form.Label>
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
              value={!resetBtnName ? btnValues.name : btnNameValue}
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />

            {btnNameHasError && resetBtnName && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
              </Alert>
            )}
            {!resetBtnName && (
              <AiFillEdit
                className={`${classes.editInput} ${classes.edit}`}
                onClick={() => setResetBtnName(true)}
              />
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
              value={!resetBtnUrl ? btnValues.url : btnUrlValue}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && resetBtnUrl && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Url.
              </Alert>
            )}
            {!resetBtnUrl && (
              <AiFillEdit
                className={`${classes.editInput} ${classes.edit}`}
                onClick={() => setResetBtnUrl(true)}
              />
            )}
          </Form.Group>
        </Row>
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      <MdDelete
        className={classes.deleteIcons}
        onClick={() => setShowDelete(true)}
      />

      {showDelete && (
        <Modal>
          <Row className={classes.deleteRow}>
            <Col lg={12}>
              <h3>Are You Sure ?</h3>
            </Col>
            <Col lg={6}>
              <Button variant="success" onClick={deleteHandler}>
                Yes
              </Button>
            </Col>
            <Col lg={6}>
              <Button variant="danger" onClick={() => setShowDelete(false)}>
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

export default UpdateHeader;
