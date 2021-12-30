import { useState } from "react";
import { Form, Col, Alert } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./login.module.css";

const isText = (value) => value.trim().length > 0;
const AddKeywords = (props) => {
  const [val, setVal] = useState(true);
  const {
    value: keyValue,
    isValid: keyIsValid,
    hasError: keyHasError,
    valueChangeHandler: keyChangeHandler,
    inputBlurHandler: keyBlurHandler,
    reset: resetKey,
  } = useInput(isText);

  const submitHandler = () => {
    props.data[props.number] = keyValue;
  };

  return (
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridMobile"
      className={classes.formGroup}
      onBlur={submitHandler}
    >
      <Form.Label className={classes.label}>
        Seo Keywords {props.number + 1}*
      </Form.Label>
      <Form.Control
        placeholder={`Seo Keywords ${props.number + 1}`}
        required
        value={
          val && props.data[props.number] ? props.data[props.number] : keyValue
        }
        onChange={keyChangeHandler}
        onBlur={keyBlurHandler}
        onFocus={() => setVal(false)}
      />

      {keyHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Seo Keywords.
        </Alert>
      )}
    </Form.Group>
  );
};

export default AddKeywords;
