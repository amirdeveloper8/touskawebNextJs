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

const UpdateAll = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTextValue, setResetTextValue] = useState(false);
  const [resetUrl, setResetUrl] = useState(false);
  const [resetImageValue, setResetImageValue] = useState(false);

  const data = props.updateData;

  const relId = data.title.related_id;
  const typeId = props.sec.type_id;
  const typeName = props.sec.type.name;
  const sectionId = props.sec.id;

  let url = "";
  if (typeId === 2) {
    url = "update/slider/slide";
  }
  if (typeId === 3) {
    url = "update/updateServiceBoxes";
  }
  if (typeId === 4) {
    url = "update/slide/SlideDown";
  }
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
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrlValue,
  } = useInput(isText);

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetTextHandler = () => {
    setResetTextValue(true);
  };

  const resetUrlHandler = () => {
    setResetUrl(true);
  };

  const resetImageHandler = () => {
    setResetImageValue(true);
  };

  let updateIsValid = false;

  if (resetTitleValue || resetTextValue || resetImageValue || resetUrl) {
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

    console.log(titleValue, textValue, selectedFile);

    fData.append("section_id", sectionId);
    fData.append("related_id", relId);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      textValue && fData.append("text", textValue);
    }
    {
      urlValue && fData.append("text", urlValue);
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
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>text*</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="text"
              required
              value={resetTextValue ? textValue : data.texts.content}
              onChange={textChangeHandler}
              onBlur={textBlurHandler}
            />

            {textHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetTextValue && (
              <Badge
                className={classes.edit}
                onClick={resetTextHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
          {data.buttons && (
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridMobile"
              className={classes.formGroup}
            >
              <Form.Label>Url*</Form.Label>
              <Form.Control
                placeholder="Url"
                required
                value={resetUrl ? urlValue : data.buttons.url}
                onChange={urlChangeHandler}
                onBlur={urlBlurHandler}
              />

              {urlHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Url.
                </Alert>
              )}
              {!resetUrl && (
                <Badge
                  className={classes.edit}
                  onClick={resetUrlHandler}
                  bg="secondary"
                >
                  edit
                </Badge>
              )}
            </Form.Group>
          )}
        </Row>
        {data.image_url && (
          <Row className={classes.control}>
            {!resetImageValue && (
              <div className={classes.updateImage}>
                <Image
                  width={600}
                  height={400}
                  src={data.image_url}
                  alt="old-image"
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
        )}
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

export default UpdateAll;
