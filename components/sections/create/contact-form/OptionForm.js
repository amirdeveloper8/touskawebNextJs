import { Alert, Col, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../create.module.css";

const isText = (value) => value.trim().length > 0;
const OptionForm = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

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
    >
      <Form.Label>option {props.number}*</Form.Label>
      <Form.Control
        type="text"
        placeholder={`option ${props.number}`}
        required
        value={titleValue}
        onChange={titleChangeHandler}
        onBlur={titleBlurHandler}
      />

      {titleHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid option.
        </Alert>
      )}
    </Form.Group>
  );
};

export default OptionForm;
