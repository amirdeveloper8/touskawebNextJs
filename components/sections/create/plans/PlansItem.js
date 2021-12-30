import classes from "../create.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";

const isText = (value) => value.trim().length > 0;

const PlansItem = (props) => {
  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    reset: resetText,
  } = useInput(isText);
  // const [textValue, setTextValue] = useState();

  const textBlurHandler = () => {
    console.log(textValue);

    if (!props.items[+props.slideNumber - 1]) {
      props.getItems(textValue);
    } else {
      props.items[+props.slideNumber - 1] = textValue;
    }
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
        value={textValue}
        onChange={textChangeHandler}
        onBlur={textBlurHandler}
      />
    </Form.Group>
  );
};

export default PlansItem;
