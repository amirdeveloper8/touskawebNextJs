import { useState } from "react";
import { Col, Form } from "react-bootstrap";

const SelectInput = (props) => {
  const data = props.data;
  const [val, setVal] = useState();

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setVal(value);
    console.log(value);
  };
  const onSubmit = () => {
    props.getValue(+props.number - 1, val);
  };
  return (
    <Form.Group as={Col} controlId={`formHorizontal${data.name}${props.id}`}>
      <Form.Label>{data.label}</Form.Label>
      <Form.Select onChange={onChangeHandler} value={val} onClick={onSubmit}>
        <option>{data.placeholder}</option>
        {JSON.parse(data.options).map((option, index) => (
          <option key={index}>{option}</option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default SelectInput;
