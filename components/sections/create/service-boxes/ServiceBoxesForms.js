import classes from "../create.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;

const ServiceBoxesForm = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [checked, setChecked] = useState(false);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success created" || notification === "error") {
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
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
    reset: resetBtnUrl,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = false;

  if (titleIsValid && textIsValid && selectedFile && btnUrlValue) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const connectDB = ConnectToDB("create/section/slider");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    console.log(props.slideCount);

    if (!props.titles[+props.slideNumber - 1]) {
      props.getTitles(titleValue);
    } else {
      props.titles[+props.slideNumber - 1] = titleValue;
    }

    if (!props.texts[+props.slideNumber - 1]) {
      props.getTexts(textValue);
    } else {
      props.texts[+props.slideNumber - 1] = textValue;
    }

    if (!props.btnNames[+props.slideNumber - 1]) {
      props.getBtnNames(btnUrlValue);
    } else {
      props.btnNames[+props.slideNumber - 1] = btnUrlValue;
    }

    if (!props.btnUrls[+props.slideNumber - 1]) {
      props.getBtnUrls(btnUrlValue);
    } else {
      props.btnUrls[+props.slideNumber - 1] = btnUrlValue;
    }

    if (!props.images[+props.slideNumber - 1]) {
      props.getImages(selectedFile);
    } else {
      props.images[+props.slideNumber - 1] = selectedFile;
    }

    setChecked(true);
  };

  return (
    <section className={classes.auth}>
      <h2>Box {props.slideNumber}</h2>
      <Form onSubmit={submitHandler}>
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
            onBlur={() => setChecked(false)}
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
            onBlur={() => setChecked(false)}
          >
            <Form.Label>text*</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="text"
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
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
            onBlur={() => setChecked(false)}
          >
            <Form.Label>Url*</Form.Label>
            <Form.Control
              rows={6}
              placeholder="Url"
              required
              value={btnUrlValue}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Url.
              </Alert>
            )}
          </Form.Group>
        </Row>
        <Row className={classes.control}>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              name="image"
              id="image"
              type="file"
              onBlur={() => setChecked(false)}
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
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

export default ServiceBoxesForm;
