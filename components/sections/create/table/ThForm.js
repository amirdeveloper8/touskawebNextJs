import { Fragment } from "react";
import { Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

const isText = (value) => value.trim().length > 0;
const ThForms = (props) => {
  const {
    value: thValue,
    isValid: thIsValid,
    hasError: thHasError,
    valueChangeHandler: thChangeHandler,
    reset: resetTh,
  } = useInput(isText);

  const thBlurHandler = () => {
    console.log(thValue);
    if (!props.thValues[+props.number - 1]) {
      props.getThs(thValue);
    } else {
      props.thValues[+props.number - 1] = thValue;
    }
  };
  return (
    <th>
      <Form.Label className="text-center w-100">Th {props.number}</Form.Label>
      <Form.Control
        type="text"
        placeholder={`Th ${props.number}`}
        required
        value={thValue}
        onChange={thChangeHandler}
        onBlur={thBlurHandler}
      />
    </th>
  );
};

export default ThForms;
