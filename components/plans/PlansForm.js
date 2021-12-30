import { Alert, Col, Form, Row } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./plans.module.css";

const isText = (value) => value.trim().length > 0;
const PlansForm = (props) => {
  const {
    value: catValue,
    isValid: catIsValid,
    hasError: catHasError,
    valueChangeHandler: catChangeHandler,
    inputBlurHandler: catBlurHandler,
    reset: resetCat,
  } = useInput(isText);

  const submitHandler = () => {
    props.catsValue[props.number] = { name: catValue };
  };
  return (
    <Row className={classes.control}>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={submitHandler}
      >
        <Form.Label>Category {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Category ${props.number + 1}`}
          value={catValue}
          onChange={catChangeHandler}
          onBlur={catBlurHandler}
        />

        {catHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Button Name.
          </Alert>
        )}
      </Form.Group>
    </Row>
  );
};

export default PlansForm;
