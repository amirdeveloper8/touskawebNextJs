import classes from "../add.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import Notification from "../../../ui/notification";
import AddPlansItem from "./AddPlansItem";

import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import AuthContext from "../../../../store/auth-context";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const AddPlans = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [items, setItems] = useState(1);
  let itemsForms = [];

  const [itemVals, setItemVals] = useState([]);

  const getItems = (item) => {
    setItemVals([...itemVals, item]);
  };

  const itemIncreaseHandler = (event) => {
    event.preventDefault();
    setItems(items + 1);
    console.log(items);
  };
  const itemDecreaseHandler = (event) => {
    event.preventDefault();
    setItems(items - 1);
    console.log(items);
  };

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const {
    value: buttonTextValue,
    isValid: buttonTextIsValid,
    hasError: buttonTextHasError,
    valueChangeHandler: buttonTextChangeHandler,
    inputBlurHandler: buttonTextBlurHandler,
    reset: resetButtonText,
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

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  for (var i = 0; i < items; i++) {
    itemsForms[i] = (
      <AddPlansItem
        key={i}
        slideNumber={i + 1}
        getItems={getItems}
        items={itemVals}
      />
    );
  }

  let formIsValid = false;

  if (titleIsValid && textIsValid) {
    formIsValid = true;
  }

  let url = "create/box/plans";

  const submitHandler = (event) => {
    event.preventDefault();

    const fData = new FormData();

    fData.append("section_id", props.secId);
    fData.append("title", titleValue);
    fData.append("subtitle", textValue);
    fData.append("button_name", buttonTextValue);
    fData.append("button_url", buttonUrlValue);
    fData.append("image", selectedFile);
    for (var i = 0; i < items; i++) {
      fData.append(`item_${i + 1}`, itemVals[i]);
    }

    const connectDB = ConnectToDB(url);

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
      <h2>plan {props.slideNumber}</h2>
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
        </Row>

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>subtitle*</Form.Label>
            <Form.Control
              placeholder="subtitle"
              required
              value={textValue}
              onChange={textChangeHandler}
              onBlur={textBlurHandler}
            />

            {textHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          {itemsForms}
          <Col className={classes.plansIcons}>
            <IoMdAddCircle
              className={classes.addItemPlans}
              onClick={itemIncreaseHandler}
            />
            {items > 1 && (
              <IoMdRemoveCircle
                className={classes.removeItemPlans}
                onClick={itemDecreaseHandler}
              />
            )}
          </Col>
        </Row>
        <Row className={classes.control}>
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
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button Text</Form.Label>
            <Form.Control
              placeholder="subtitle"
              required
              value={buttonTextValue}
              onChange={buttonTextChangeHandler}
              onBlur={buttonTextBlurHandler}
            />

            {buttonTextHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid button Text.
              </Alert>
            )}
          </Form.Group>
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button url</Form.Label>
            <Form.Control
              placeholder="subtitle"
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

export default AddPlans;
