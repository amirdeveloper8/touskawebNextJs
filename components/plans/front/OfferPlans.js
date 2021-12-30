import { useState } from "react";
import { Form } from "react-bootstrap";
import classes from "./plans-front.module.css";

const OfferPlans = (props) => {
  const [value, setValue] = useState(false);
  const valSend = { name: props.value.name, price: props.value.price };
  const emptySend = { name: "", price: "" };

  const handleChange = (e) => {
    let isChecked = e.target.checked;
    setValue(isChecked);
  };

  const submitHandler = () => {
    if (value) {
      props.valueOffers[props.number] = valSend;
    }

    if (!value) {
      props.valueOffers[props.number] = emptySend;
    }
  };

  return (
    <Form.Group
      className={classes.checkBox}
      controlId={`formBasicCheckbox${props.number}`}
      onBlur={submitHandler}
    >
      <Form.Check
        type="checkbox"
        label={props.value.name}
        onChange={(e) => handleChange(e)}
        value={value}
      />
    </Form.Group>
  );
};

export default OfferPlans;
