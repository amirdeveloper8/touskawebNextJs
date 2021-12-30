import { Fragment } from "react";
import { Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

const isText = (value) => value.trim().length > 0;
const TfForm = (props) => {
  const {
    value: tfValue,
    isValid: tfIsValid,
    hasError: tfHasError,
    valueChangeHandler: tfChangeHandler,
    reset: resetTf,
  } = useInput(isText);

  const tfBlurHandler = () => {
    console.log(tfValue);
    if (!props.tfValues[+props.number - 1]) {
      props.getTfs(tfValue);
    } else {
      props.tfValues[+props.number - 1] = tfValue;
    }
  };
  return (
    <th>
      <Form.Label className="text-center w-100">Tf {props.number}</Form.Label>
      <Form.Control
        type="text"
        placeholder={`Tf ${props.number}`}
        required
        value={tfValue}
        onChange={tfChangeHandler}
        onBlur={tfBlurHandler}
      />
    </th>
  );
};

export default TfForm;
