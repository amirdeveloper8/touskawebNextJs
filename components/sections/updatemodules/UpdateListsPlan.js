import classes from "./update.module.css";
import { Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";

const isText = (value) => value.trim().length > 0;

const UpdateListsPlans = (props) => {
  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    reset: resetText,
  } = useInput(isText);
  const [resetTextValue, setResetTextValue] = useState(false);

  const resetTextHandler = () => {
    setResetTextValue(true);
    props.resetList();
  };

  const textBlurHandler = () => {
    console.log(textValue);

    props.items[+props.slideNumber - 1] = textValue;
  };

  return (
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridMobile"
      className={classes.formGroup}
    >
      <Form.Label>item {props.slideNumber}</Form.Label>
      <Form.Control
        placeholder={`item ${props.slideNumber}`}
        value={resetTextValue ? textValue : props.item}
        onChange={textChangeHandler}
        onBlur={textBlurHandler}
      />

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
  );
};

export default UpdateListsPlans;
