import { Fragment } from "react";
import { Col, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

const isText = (value) => value.trim().length > 0;
const CommentForm = (props) => {
  const {
    value: cmValue,
    isValid: cmIsValid,
    hasError: cmHasError,
    valueChangeHandler: cmChangeHandler,
    reset: resetCm,
  } = useInput(isText);

  const cmBlurHandler = () => {
    console.log(cmValue);
    if (!props.cmValues[+props.number - 1]) {
      props.getCms(cmValue);
    } else {
      props.cmValues[+props.number - 1] = cmValue;
    }
  };
  return (
    <Col className="mx-2" lg={5} sm={12}>
      <Form.Label className="text-center w-100">
        Comment {props.number}
      </Form.Label>
      <Form.Control
        type="text"
        as="textarea"
        placeholder={`Comment ${props.number}`}
        required
        value={cmValue}
        onChange={cmChangeHandler}
        onBlur={cmBlurHandler}
      />
    </Col>
  );
};

export default CommentForm;
