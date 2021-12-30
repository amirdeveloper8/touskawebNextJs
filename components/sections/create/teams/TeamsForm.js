import classes from "../create.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;
const isInsta = (value) => value.includes("instagram");
const isTwitter = (value) => value.includes("twitter");

const TeamsForm = (props) => {
  const [checked, setChecked] = useState(false);

  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

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
    value: instagramValue,
    isValid: instagramIsValid,
    hasError: instagramHasError,
    valueChangeHandler: instagramChangeHandler,
    inputBlurHandler: instagramBlurHandler,
    reset: resetInstagram,
  } = useInput(isInsta);

  const {
    value: twitterValue,
    isValid: twitterIsValid,
    hasError: twitterHasError,
    valueChangeHandler: twitterChangeHandler,
    inputBlurHandler: twitterBlurHandler,
    reset: resetTwitter,
  } = useInput(isTwitter);

  const {
    value: characterValue,
    isValid: characterIsValid,
    hasError: characterHasError,
    valueChangeHandler: characterChangeHandler,
    inputBlurHandler: characterBlurHandler,
    reset: resetcharacter,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = false;

  if (titleIsValid && textIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    const connectDB = ConnectToDB("create/section/slider");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    console.log(props.slideCount);

    if (!props.names[+props.slideNumber - 1]) {
      props.getNames(titleValue);
    } else {
      props.names[+props.slideNumber - 1] = titleValue;
    }

    if (!props.posts[+props.slideNumber - 1]) {
      props.getPosts(textValue);
    } else {
      props.posts[+props.slideNumber - 1] = textValue;
    }

    if (!props.instagrams[+props.slideNumber - 1]) {
      props.getInstagrams(instagramValue);
    } else {
      props.instagrams[+props.slideNumber - 1] = instagramValue;
    }

    if (!props.twitters[+props.slideNumber - 1]) {
      props.getTwitters(twitterValue);
    } else {
      props.twitters[+props.slideNumber - 1] = twitterValue;
    }

    if (!props.characters[+props.slideNumber - 1]) {
      props.getCharacters(characterValue);
    } else {
      props.characters[+props.slideNumber - 1] = characterValue;
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
      <h2>Person {props.slideNumber}</h2>
      <Form onSubmit={submitHandler}>
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            onBlur={() => setChecked(false)}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Name*</Form.Label>
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
            onBlur={() => setChecked(false)}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Post*</Form.Label>
            <Form.Control
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

        <Row className={classes.control}>
          <Form.Group className="mb-3">
            <Form.Label>Image*</Form.Label>
            <Form.Control
              name="image"
              id="image"
              required
              type="file"
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
          </Form.Group>
        </Row>

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            onBlur={() => setChecked(false)}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Instagram</Form.Label>
            <Form.Control
              placeholder="Instagram Link"
              value={instagramValue}
              required
              onChange={instagramChangeHandler}
              onBlur={instagramBlurHandler}
            />

            {instagramHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Instagram Link.
              </Alert>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            onBlur={() => setChecked(false)}
            lg={12}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Twitter</Form.Label>
            <Form.Control
              placeholder="Twitter Link"
              value={twitterValue}
              required
              onChange={twitterChangeHandler}
              onBlur={twitterBlurHandler}
            />

            {twitterHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Twiiter Link.
              </Alert>
            )}
          </Form.Group>
        </Row>

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            onBlur={() => setChecked(false)}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Character</Form.Label>
            <Form.Control
              placeholder="Character"
              required
              value={characterValue}
              onChange={characterChangeHandler}
              onBlur={characterBlurHandler}
            />

            {characterHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
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

export default TeamsForm;
