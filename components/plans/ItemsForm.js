import { useState } from "react";
import { Alert, Col, Form, Row } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./plans.module.css";

const isText = (value) => value.trim().length > 0;
const ItemsForm = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [typeValue, setTypeValue] = useState();
  const {
    value: itemValue,
    isValid: itemIsValid,
    hasError: itemHasError,
    valueChangeHandler: itemChangeHandler,
    inputBlurHandler: itemBlurHandler,
    reset: resetItem,
  } = useInput(isText);
  const {
    value: priceValue,
    isValid: priceIsValid,
    hasError: priceHasError,
    valueChangeHandler: priceChangeHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPrice,
  } = useInput(isText);

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);

    setTypeValue(+val[0]);
    console.log("value", typeValue);
  };

  const submitHandler = () => {
    props.catsValue[props.number] = {
      category_semi_id: typeValue,
      name: itemValue,
      price: priceValue,
    };
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
        <Form.Label>Select Category*</Form.Label>
        <Form.Select
          value={valueBox}
          onChange={changeHandler}
          aria-label="Default select example"
        >
          <option>انتخاب پلن ...</option>
          {props.cats.map((box) => (
            <option key={box.id} value={`${box.id}.${box.name}`}>
              {box.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={submitHandler}
      >
        <Form.Label>Item {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Item ${props.number + 1}`}
          value={itemValue}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Button Name.
          </Alert>
        )}
      </Form.Group>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={submitHandler}
      >
        <Form.Label>Price {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Price ${props.number + 1}`}
          value={priceValue}
          onChange={priceChangeHandler}
          onBlur={priceBlurHandler}
        />

        {priceHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Button Name.
          </Alert>
        )}
      </Form.Group>
    </Row>
  );
};

export default ItemsForm;
