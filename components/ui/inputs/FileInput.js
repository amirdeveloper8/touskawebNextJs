import { useState } from "react";
import { Form } from "react-bootstrap";

const FileInput = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };
  return (
    <Form.Group className="mb-3">
      <Form.Label>{props.name}</Form.Label>
      <Form.Control
        lg={12}
        name={props.name}
        id="image"
        type="file"
        onChange={(e) => handleChange(e.target.files)}
        onBlur={() => props.getValue(+props.number - 1, selectedFile)}
        size="sm"
      />
    </Form.Group>
  );
};

export default FileInput;
