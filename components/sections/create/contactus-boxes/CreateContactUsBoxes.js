import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import ContactUsForm from "./ContactUsForm";
import Notification from "../../../ui/notification";
import { getData } from "../../../../lib/get-data";

const isText = (value) => value.trim().length > 0;
const CreateContactUsBoxes = (props) => {
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

  const [slideCount, setSlideCount] = useState(0);
  const [titles, setTitles] = useState([]);
  const [boxId, setBoxId] = useState([]);
  const [images, setImages] = useState([]);
  const [socialValues, setSocialValues] = useState([]);

  const [boxes, setBoxes] = useState([]);
  const [socials, setSocials] = useState([]);
  let sliders = [];

  useEffect(() => {
    if (notification === "success created" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const getTitles = (title) => {
    setTitles([...titles, title]);
  };

  const getBoxId = (id) => {
    setBoxId([...boxId, id]);
  };

  const getImages = (image) => {
    setImages([...images, image]);
  };

  const getSocials = (val) => {
    setSocialValues([...socialValues, val]);
  };

  const slideNumberHandleChange = async (e) => {
    setSlideCount(e.target.value);
    const boxDetails = await getData("get/contactform/typeBox");
    const socialDetails = await getData("get/contactform/typeSocial");
    setBoxes(boxDetails.typeBox);
    setSocials(socialDetails.typeSocial);
  };
  for (var i = 0; i < slideCount; i++) {
    sliders[i] = (
      <ContactUsForm
        getTitles={getTitles}
        getBoxId={getBoxId}
        titles={titles}
        boxId={boxId}
        slideCount={slideCount}
        slideNumber={i + 1}
        key={i}
        boxes={boxes}
        socials={socials}
        getSocials={getSocials}
        socialValues={socialValues}
      />
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");
    const fData = new FormData();

    fData.append("page_id", props.pageId);
    fData.append("type_id", 14);
    fData.append("title", titleValue);
    fData.append("count", slideCount);
    for (var i = 0; i < slideCount; i++) {
      fData.append(`type_box_id_${i + 1}`, boxId[i]);
      fData.append(`body_box_${i + 1}`, socialValues[i]);
      fData.append(`title_box_${i + 1}`, titles[i]);
    }

    const connectDB = ConnectToDB("create/ContactUsBoxes");

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
            authCtx.closeContactUsBoxesSectionSection();
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
    (titles.length && boxId.length && socialValues.length) === +slideCount
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
            <Form.Label>تعداد اسلایدها</Form.Label>
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

export default CreateContactUsBoxes;
