import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import Notification from "../../../ui/notification";
import PlansForm from "./PlansForm";

const isText = (value) => value.trim().length > 0;
const CreatePalns = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: subtitleValue,
    isValid: subtitleIsValid,
    hasError: subtitleHasError,
    valueChangeHandler: subtitleChangeHandler,
    inputBlurHandler: subtitleBlurHandler,
    reset: resetSubtitle,
  } = useInput(isText);

  const [selectedFile, setSelectedFile] = useState(null);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [slideCount, setSlideCount] = useState(1);
  const [titles, setTitles] = useState([]);
  const [subtitles, setSubtitles] = useState([]);
  const [items, setItems] = useState([]);
  const [buttonText, setButtonText] = useState([]);
  const [buttonUrl, setButtonUrl] = useState([]);
  const [images, setImages] = useState([]);
  let sliders = [];

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const getTitles = (title) => {
    setTitles([...titles, title]);
  };

  const getSubtitles = (subtitle) => {
    setSubtitles([...subtitles, subtitle]);
  };

  const getImages = (image) => {
    setImages([...images, image]);
  };

  const getItems = (item) => {
    setItems([...items, item]);
  };

  const getBtnText = (btnTxt) => {
    setButtonText([...buttonText, btnTxt]);
  };

  const getBtnUrl = (btnUrl) => {
    setButtonUrl([...buttonUrl, btnUrl]);
  };

  const slideNumberHandleChange = (e) => {
    setSlideCount(e.target.value);
  };
  for (var i = 0; i < slideCount; i++) {
    sliders[i] = (
      <PlansForm
        getTitles={getTitles}
        getSubtitles={getSubtitles}
        getImages={getImages}
        getItems={getItems}
        getBtnText={getBtnText}
        getBtnUrl={getBtnUrl}
        titles={titles}
        subtitles={subtitles}
        images={images}
        items={items}
        slideCount={slideCount}
        buttonText={buttonText}
        buttonUrl={buttonUrl}
        slideNumber={i + 1}
        key={i}
      />
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    items.map((itemA, index) =>
      itemA.map((item, idx) =>
        fData.append(`item_box_${index + 1}_${idx + 1}`, `${item}`)
      )
    );

    for (var i = 0; i < slideCount; i++) {
      fData.append("page_id", props.pageId);
      fData.append("type_id", 5);
      fData.append("title", titleValue);
      fData.append("subtitle", subtitleValue);
      fData.append("image", selectedFile);
      fData.append("count", slideCount);
      fData.append(`title_box_${i + 1}`, titles[i]);
      fData.append(`subtitle_box_${i + 1}`, subtitles[i]);
      fData.append(`image_box_${i + 1}`, images[i]);
      fData.append(`button_box_name_${i + 1}`, buttonText[i]);
      fData.append(`button_box_url_${i + 1}`, buttonUrl[i]);
    }

    const connectDB = ConnectToDB("create/section/plans");

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
            authCtx.closePlansSection();
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
    (titles.length && images.length && subtitles.length) === +slideCount
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
            <Form.Label>تعداد باکس‌ها</Form.Label>
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
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Subtitle</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Subtitle"
              value={subtitleValue}
              onChange={subtitleChangeHandler}
              onBlur={subtitleBlurHandler}
            />
          </Form.Group>
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

export default CreatePalns;
