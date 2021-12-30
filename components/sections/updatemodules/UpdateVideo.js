import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";
import ListAccordion from "../getdata/ListAccordion";
import NewRich from "../../richtexteditor/NewRich";

const isText = (value) => value.trim().length > 0;

const UpdateVideo = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetSubValue, setResetSubValue] = useState(false);
  const [resetSrcValue, setResetSrcValue] = useState(false);

  const data = props.updateData;

  const pageId = props.sec.page_id;
  const sectionId = props.sec.id;

  console.log("typeId", pageId);

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

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetSubHandler = () => {
    setResetSubValue(true);
  };

  const resetSrcHandler = () => {
    setResetSrcValue(true);
  };

  let updateIsValid = false;

  if (resetTitleValue || resetSubValue || resetSrcValue) {
    updateIsValid = true;
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("update/section/video");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, subValue, srcValue);

    fData.append("section_id", sectionId);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      subValue && fData.append("subtitle", subValue);
    }
    {
      srcValue && fData.append("src", srcValue);
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
    <section className={classes.auth}>
      <h1>Update Module Simple</h1>

      <Form onSubmit={submitHandler}>
        <Row className={classes.control}>
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
              value={resetTitleValue ? titleValue : props.sec.title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
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
          {props.sec.subtitle && (
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
                as="textarea"
                rows={4}
                value={resetSubValue ? subValue : props.sec.subtitle}
                onChange={subChangeHandler}
                onBlur={subBlurHandler}
              />

              {subHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Name.
                </Alert>
              )}
              {!resetSubValue && (
                <Badge
                  className={classes.edit}
                  onClick={resetSubHandler}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Src</Form.Label>
            <Form.Control
              type="text"
              placeholder="Src"
              required
              value={resetSrcValue ? srcValue : data.src}
              onChange={srcChangeHandler}
              onBlur={srcBlurHandler}
            />

            {srcHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetSrcValue && (
              <Badge
                className={classes.edit}
                onClick={resetSrcHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
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

export default UpdateVideo;
