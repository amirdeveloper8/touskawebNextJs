import { Fragment } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import useInput from "../../hooks/use-input";

import classes from "./footer.module.css";

const isUrl = (value) => value.includes("http");
const isText = (value) => value.trim().length > 0;
const CreateLink1 = (props) => {
  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isText);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput(isText);

  const submitHandler = () => {
    const value = { name: nameValue, url: urlValue };
    props.linkUrls[props.number] = value;
  };
  return (
    <Row className={classes.createRow}>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        onBlur={submitHandler}
      >
        <Form.Label>Name {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Name ${props.number + 1}`}
          value={nameValue}
          onChange={nameChangeHandler}
          onBlur={nameBlurHandler}
        />

        {nameHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
      </Form.Group>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        onBlur={submitHandler}
      >
        <Form.Label>link {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`link ${props.number + 1}`}
          value={urlValue}
          onChange={urlChangeHandler}
          onBlur={urlBlurHandler}
        />

        {urlHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid url.
          </Alert>
        )}
      </Form.Group>
    </Row>
  );
};

export default CreateLink1;
