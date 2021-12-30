import classes from "../create.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import ContactItems from "./ContactItems";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { RiAddBoxFill } from "react-icons/ri";

import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;

const ContactUsForm = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [valueBox, setValueBox] = useState();
  const [socialCount, setSocialCount] = useState(1);
  const [socialValues, setSocialValues] = useState([]);
  const [socialUrls, setSocialUrls] = useState([]);
  const [socialNames, setSocialNames] = useState([]);

  const [checked, setChecked] = useState(false);

  const onChangeBox = (e) => {
    const value = e.target.value;
    setValueBox(value);
    console.log(valueBox);
  };

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

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = true;

  if (titleIsValid && textIsValid) {
    formIsValid = true;
  }

  let socialDetails = [];

  for (let i = 0; i < socialCount; i++) {
    socialDetails[i] = "";
  }

  const getSocials = (val) => {
    setSocialValues([...socialValues, val]);
  };

  const getUrls = (val) => {
    setSocialUrls([...socialUrls, val]);
  };

  const getNames = (val) => {
    setSocialNames([...socialNames, val]);
  };

  let socials = [];

  for (let i = 0; i < socialCount; i++) {
    socials[i] = (
      <ContactItems
        socialValues={socialValues}
        getSocials={getSocials}
        socialUrls={socialUrls}
        getUrls={getUrls}
        getNames={getNames}
        socialNames={socialNames}
        socials={props.socials}
        key={i}
        slideNumber={i + 1}
      />
    );
  }

  const increaseSocial = () => {
    setSocialCount(socialCount + 1);
  };

  const decreaseSocial = () => {
    setSocialCount(socialCount - 1);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const connectDB = ConnectToDB("create/section/slider");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const BoxDetails = valueBox.split(".");

    const BoxId = BoxDetails[0];
    const BoxName = BoxDetails[1];
    console.log(BoxId, BoxName);
    console.log(socialValues);
    console.log(socialUrls);
    let bodyBox = [];
    for (let i = 0; i < socialValues.length; i++) {
      bodyBox[i] = {
        type_id: socialValues[i],
        name: socialNames[i],
        url: socialUrls[i],
      };
    }
    console.log(bodyBox);

    if (props.titles[+props.slideNumber - 1]) {
      props.titles[+props.slideNumber - 1] = titleValue;
    }
    if (!props.titles[+props.slideNumber - 1]) {
      props.getTitles(titleValue);
    }

    if (props.boxId[+props.slideNumber - 1]) {
      props.boxId[+props.slideNumber - 1] = BoxId;
    }
    if (!props.boxId[+props.slideNumber - 1]) {
      props.getBoxId(BoxId);
    }

    if (props.socialValues[+props.slideNumber - 1]) {
      props.socialValues[+props.slideNumber - 1] = JSON.stringify(bodyBox);
    }
    if (!props.socialValues[+props.slideNumber - 1]) {
      props.getSocials(JSON.stringify(bodyBox));
    }

    setChecked(true);
  };

  return (
    <section className={classes.auth}>
      <h2>Slide {props.slideNumber}</h2>
      <Form onSubmit={submitHandler}>
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            onBlur={() => setChecked(false)}
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Select
              onChange={onChangeBox}
              value={valueBox}
              aria-label="Default select example"
            >
              <option>Select type box</option>
              {props.boxes.map((box) => (
                <option key={box.id} value={`${box.id}.${box.name}`}>
                  {box.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group
            onBlur={() => setChecked(false)}
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

        <Row className={`mb-3 ${classes.control}`}>
          <h3>Items</h3>
          {socials}
          <div className={classes.socialContactIcons}>
            <RiAddBoxFill
              onClick={increaseSocial}
              className={classes.addSocialContact}
            />
            {socialCount > 1 && (
              <RiDeleteBin7Fill
                onClick={decreaseSocial}
                className={classes.delSocialContact}
              />
            )}
          </div>
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

export default ContactUsForm;
