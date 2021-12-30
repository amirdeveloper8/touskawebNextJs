import { useState } from "react";
import { Badge, Col, Form, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../update.module.css";

const isText = (value) => value.trim().length > 0;
const UpdateOptionForm = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const [reset, setReset] = useState(false);

  const resetHandler = () => {
    props.optionUpdateHandler(true);
    setReset(true);
  };

  const submitInputs = () => {
    if (!props.options[+props.number - 1]) {
      props.getOptions(titleValue);
    } else {
      props.options[+props.number - 1] = titleValue;
    }
  };
  return (
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridFName"
      className={classes.formGroup}
      onBlur={submitInputs}
      onClick={() => props.optionUpdateHandler(true)}
    >
      <Form.Label>option {props.number}*</Form.Label>
      <Form.Control
        type="text"
        placeholder={`option ${props.number}`}
        required
        value={reset ? titleValue : props.name}
        onChange={titleChangeHandler}
        onBlur={titleBlurHandler}
      />

      {titleHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid option.
        </Alert>
      )}
      {!reset && (
        <Badge className={classes.edit} onClick={() => setReset(true)}>
          edit
        </Badge>
      )}
    </Form.Group>
  );
};

export default UpdateOptionForm;
