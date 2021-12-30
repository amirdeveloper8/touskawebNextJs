import classes from "../create.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import Notification from "../../../ui/notification";
import PlansItem from "./PlansItem";

import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;

const PlansForm = (props) => {
  const [checked, setChecked] = useState(false);
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

  for (var i = 0; i < items; i++) {
    itemsForms[i] = (
      <PlansItem
        key={i}
        slideNumber={i + 1}
        getItems={getItems}
        items={itemVals}
      />
    );
  }

  let formIsValid = false;

  if (
    titleIsValid &&
    textIsValid &&
    selectedFile &&
    buttonTextIsValid &&
    buttonUrlIsValid
  ) {
    formIsValid = true;
  }

  const submitHandler = (event) => {
    event.preventDefault();

    console.log(props.slideCount);

    if (!props.titles[+props.slideNumber - 1]) {
      props.getTitles(titleValue);
    } else {
      props.titles[+props.slideNumber - 1] = titleValue;
    }

    if (!props.subtitles[+props.slideNumber - 1]) {
      props.getSubtitles(textValue);
    } else {
      props.subtitles[+props.slideNumber - 1] = textValue;
    }

    if (!props.buttonText[+props.slideNumber - 1]) {
      props.getBtnText(buttonTextValue);
    } else {
      props.buttonText[+props.slideNumber - 1] = buttonTextValue;
    }

    if (!props.buttonUrl[+props.slideNumber - 1]) {
      props.getBtnUrl(buttonUrlValue);
    } else {
      props.buttonUrl[+props.slideNumber - 1] = buttonUrlValue;
    }

    if (!props.images[+props.slideNumber - 1]) {
      props.getImages(selectedFile);
    } else {
      props.images[+props.slideNumber - 1] = selectedFile;
    }

    if (!props.items[+props.slideNumber - 1]) {
      props.getItems(itemVals);
    } else {
      props.items[+props.slideNumber - 1] = itemVals;
    }

    console.log("items", itemVals);
    console.log("prop", props.items);
    console.log("buttonUrl", props.buttonUrl);
    console.log("buttonText", props.buttonText);
    setChecked(true);
  };

  return (
    <section className={classes.auth}>
      <h2>plan {props.slideNumber}</h2>
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
          <Form.Group
            as={Col}
            onBlur={() => setChecked(false)}
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
            onBlur={() => setChecked(false)}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Button Name</Form.Label>
            <Form.Control
              placeholder="subtitle"
              required
              value={buttonTextValue}
              onChange={buttonTextChangeHandler}
              onBlur={buttonTextBlurHandler}
            />

            {buttonTextHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
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
            <Form.Label>Button url</Form.Label>
            <Form.Control
              placeholder="Button url"
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

export default PlansForm;
