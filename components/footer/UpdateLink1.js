import { Fragment, useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import useInput from "../../hooks/use-input";

import { AiFillEdit } from "react-icons/ai";

import classes from "./footer.module.css";

const isUrl = (value) => value.includes("http");
const isText = (value) => value.trim().length > 0;
const UpdateLink1 = (props) => {
  if (props.details) {
    const name = props.details.name;
    const url = props.details.url;
  }

  const [resetName, setResetName] = useState(false);
  const [resetUrl, setResetUrl] = useState(false);
  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
  } = useInput(isText);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput(isText);

  const submitHandler = () => {
    if (props.details) {
      const value = {
        name: resetName ? nameValue : props.details.name,
        url: resetUrl ? urlValue : props.details.url,
      };

      props.linkUrls[props.number] = value;
    }
    if (!props.details) {
      const value = {
        name: nameValue,
        url: urlValue,
      };
      props.linkUrls[props.number] = value;
    }
  };
  return (
    <Fragment>
      {props.details && (
        <Row className={classes.createRow}>
          <Form.Group
            className={classes.formLinks}
            as={Col}
            lg={12}
            controlId="formGridFName"
            onBlur={submitHandler}
          >
            <Form.Label>Name {props.number + 1}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Name ${props.number + 1}`}
              value={resetName ? nameValue : name}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />
            {!resetName && (
              <AiFillEdit
                className={classes.edit}
                onClick={() => setResetName(true)}
              />
            )}

            {nameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>
          <Form.Group
            className={classes.formLinks}
            as={Col}
            lg={12}
            controlId="formGridFName"
            onBlur={submitHandler}
          >
            <Form.Label>link {props.number + 1}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`link ${props.number + 1}`}
              value={resetUrl ? urlValue : url}
              onChange={urlChangeHandler}
              onBlur={urlBlurHandler}
            />
            {!resetUrl && (
              <AiFillEdit
                className={classes.edit}
                onClick={() => setResetUrl(true)}
              />
            )}

            {urlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid url.
              </Alert>
            )}
          </Form.Group>
        </Row>
      )}

      {!props.details && (
        <Row className={classes.createRow}>
          <Form.Group
            className={classes.formLinks}
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
            className={classes.formLinks}
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
      )}
    </Fragment>
  );
};

export default UpdateLink1;
