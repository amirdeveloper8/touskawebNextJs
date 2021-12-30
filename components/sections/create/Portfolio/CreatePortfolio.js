import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import PortfolioForm from "./PortfolioForm";
import Notification from "../../../ui/notification";

const isText = (value) => value.trim().length > 0;
const CreatePortfolio = (props) => {
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

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [slideCount, setSlideCount] = useState(1);
  const [titles, setTitles] = useState([]);
  const [buttonNames, setButtonNames] = useState([]);
  const [buttonUrls, setButtonUrls] = useState([]);
  const [images, setImages] = useState([]);
  let sliders = [];

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const getTitles = (title) => {
    setTitles([...titles, title]);
  };

  const getButtonNames = (name) => {
    setButtonNames([...buttonNames, name]);
  };

  const getButtonUrls = (url) => {
    setButtonUrls([...buttonUrls, url]);
  };

  const getImages = (image) => {
    setImages([...images, image]);
  };

  const slideNumberHandleChange = (e) => {
    setSlideCount(e.target.value);
  };
  for (var i = 0; i < slideCount; i++) {
    sliders[i] = (
      <PortfolioForm
        getTitles={getTitles}
        getButtonNames={getButtonNames}
        getButtonUrls={getButtonUrls}
        getImages={getImages}
        titles={titles}
        buttonNames={buttonNames}
        buttonUrls={buttonUrls}
        images={images}
        slideCount={slideCount}
        slideNumber={i + 1}
        key={i}
      />
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    for (var i = 0; i < slideCount; i++) {
      fData.append("page_id", props.pageId);
      fData.append("type_id", 9);
      fData.append("title", titleValue);
      // fData.append("button_url", btnNameValue);
      // fData.append("button_name", btnUrlValue);
      fData.append("count", slideCount);
      fData.append(`title_item_${i + 1}`, titles[i]);
      fData.append(`button_name_${i + 1}`, buttonNames[i]);
      console.log(`button_name_${i + 1}`, buttonNames[i]);
      fData.append(`button_url_${i + 1}`, buttonUrls[i]);
      fData.append(`image_item_${i + 1}`, images[i]);
    }

    const connectDB = ConnectToDB("create/section/portfolio");

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
        if (res.data.status === "success created") {
          setNotification(res.data.status);

          setTimeout(() => {
            authCtx.closePageHandler();
            props.getData();
          }, 2000);
          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closePortfolioSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });
  };

  let formIsValid = false;

  if (
    titleIsValid &&
    (titles.length &&
      images.length &&
      buttonNames.length &&
      buttonUrls.length) === +slideCount
  ) {
    formIsValid = true;
  }

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
    <div className={classes.sliders}>
      <Form onSubmit={submitHandler}>
        <Row className={classes.controlFirstForm}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Counts</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="slide Number"
              required
              value={slideCount}
              onChange={slideNumberHandleChange}
            />
          </Form.Group>
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
          {/* <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button name"
              value={btnNameValue}
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />

            {btnNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group> */}
          {/* <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button Url*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button Url"
              value={btnUrlValue}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group> */}
        </Row>

        <div className={`${classes.actions} ${classes.submitactions}`}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      <div className={classes.slidesForm}>{sliders}</div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </div>
  );
};

export default CreatePortfolio;
