import { useState } from "react";
import { Col, Form } from "react-bootstrap";

const RadioInput = (props) => {
  const data = props.data;
  const [val, setVal] = useState();

  const submitHandler = () => {
    props.getValue(+props.number - 1, val);
  };
  return (
    <Form.Group
      className="mb-3"
      controlId={`formHorizontal${data.name}${props.id}`}
    >
      <Form.Label className="w-100" as="legend" column sm={2}>
        {data.label}
      </Form.Label>
      {JSON.parse(data.options).map((option, index) => (
        <Col key={index} sm={10}>
          {option !== "" && (
            <Form.Check
              type={data.type_namee === "radioButton" ? "radio" : "checkbox"}
              label={option}
              name={
                data.type_namee === "radioButton"
                  ? `formHorizontalCheck${props.id}`
                  : option
              }
              id={`formHorizontalRadios${index + 1}`}
              onChange={() => setVal(option)}
              onClick={() => console.log(value)}
              onBlur={submitHandler}
            />
          )}
        </Col>
      ))}
    </Form.Group>
  );
};

export default RadioInput;
