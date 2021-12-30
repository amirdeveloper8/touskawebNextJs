import { useEffect } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import useInput from "../../../hooks/use-input";
import classes from "./input.module.css";

const isText = (value) => value.trim().length > 0;
const isEmail = (value) => value.trim().includes("@");
const BaseInput = (props) => {
  const data = props.data;
  const type = data.type_namee;
  let validType = isText;
  let inputType = "text";
  let contId = `formHorizontal${data.name}${props.number}`;
  let asType;
  if (type === "email") {
    validType = isEmail;
    inputType = "email";
  }
  if (type === "number") {
    inputType = "number";
  }
  if (type === "password") {
    inputType = "password";
  }
  if (type === "textarea") {
    asType = "textarea";
  }
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(validType);

  const submitHandler = () => {
    props.getValue(+props.number - 1, titleValue);
  };
  return (
    <Form.Group onBlur={submitHandler} as={Col} lg={12} controlId={contId}>
      <Form.Label>{data.label}*</Form.Label>
      <Form.Control
        type={data.type_namee === "colorpicker" ? "color" : type}
        as={asType}
        placeholder={data.placeholder}
        required={data.valid}
        value={titleValue}
        onChange={titleChangeHandler}
        onBlur={titleBlurHandler}
      />

      {data.valid && titleHasError && (
        <Alert className="mt-1" variant="danger">
          {data.valid}
        </Alert>
      )}
    </Form.Group>
  );
};

export default BaseInput;
