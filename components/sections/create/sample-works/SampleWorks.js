import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import Notification from "../../../ui/notification";
import ProjectsForm from "./ProjectsForm";

const isText = (value) => value.trim().length > 0;
const SampleWorks = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [slideCount, setSlideCount] = useState(1);
  const [titles, setTitles] = useState([]);
  const [images, setImages] = useState([]);

  const [titleProjects, setTitleProjects] = useState([]);
  const [nameProjects, setNameProjects] = useState([]);
  const [imageProjects, setImageProjects] = useState([]);
  const [buttonNames, setButtonNames] = useState([]);
  const [buttonUrls, setButtonUrls] = useState([]);

  let projects = [];

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const getTitles = (title) => {
    setTitles([...titles, title]);
  };

  const getTitleProjects = (title) => {
    setTitleProjects([...titleProjects, title]);
  };

  const getNameProjects = (name) => {
    setNameProjects([...nameProjects, name]);
  };

  const getImageProjects = (img) => {
    setImageProjects([...imageProjects, img]);
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
    projects[i] = (
      <ProjectsForm
        key={i}
        slideCount={slideCount}
        slideNumber={i + 1}
        getTitles={getTitles}
        getImages={getImages}
        titles={titles}
        images={images}
        getButtonNames={getButtonNames}
        getButtonUrls={getButtonUrls}
        buttonNames={buttonNames}
        buttonUrls={buttonUrls}
        titleProjects={titleProjects}
        nameProjects={nameProjects}
        imageProjects={imageProjects}
        getTitleProjects={getTitleProjects}
        getNameProjects={getNameProjects}
        getImageProjects={getImageProjects}
      />
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    for (var i = 0; i < slideCount; i++) {
      fData.append("page_id", props.pageId);
      fData.append("type_id", 10);
      fData.append("title", titleValue);
      fData.append("count", slideCount);
      fData.append(`title_box_item_${i + 1}`, titles[i]);
      fData.append(`image_box_item_${i + 1}`, images[i]);
      fData.append(`title_project_item_${i + 1}`, titleProjects[i]);
      fData.append(`name_project_item_${i + 1}`, nameProjects[i]);
      fData.append(`url_project_item_${i + 1}`, buttonUrls[i]);
      fData.append(`button_project_url_item_${i + 1}`, buttonUrls[i]);
      fData.append(`button_project_name_item_${i + 1}`, buttonNames[i]);
      fData.append(`image_project_item_${i + 1}`, imageProjects[i]);
    }

    const connectDB = ConnectToDB("create/section/portfolioContent");

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
        console.log("Error", err.response);
        setNotification("error");
        setdataError(err.response.data.message);
      });
  };

  let formIsValid = false;

  if (
    titleIsValid &&
    (titles.length &&
      titleProjects.length &&
      nameProjects.length &&
      images.length &&
      imageProjects.length &&
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
              max={4}
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
        </Row>

        <div className={`${classes.actions} ${classes.submitactions}`}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      <div className={classes.slidesForm}>{projects}</div>
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

export default SampleWorks;
