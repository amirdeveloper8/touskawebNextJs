import { Fragment, useState } from "react";
import { Alert, Col, Form } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./footer.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;

const CreateSocials = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isText);

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);
    console.log(valueBox);
    setChecked(false);

    setBoxName(val[1]);
    setTypeValue(val[2]);
  };

  let boxId = 0;

  const submitHandler = () => {
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];

    const value = { content: urlValue, url: urlValue, type_id: +boxId };
    console.log(value);

    props.value[props.number] = value;
  };

  return (
    <Form.Group
      onBlur={() => setChecked(false)}
      as={Col}
      lg={12}
      controlId={`formGridFName${props.number}`}
      className={classes.createRow}
    >
      <Form.Select
        value={valueBox}
        onChange={changeHandler}
        aria-label="Default select example"
      >
        <option>Select Item ...</option>
        {props.socials
          .filter((item) => item.type !== "url")
          .map((box) => (
            <option key={box.id} value={`${box.id}.${box.name}.${box.type}`}>
              {box.name} ({box.type})
            </option>
          ))}
      </Form.Select>
      {checked && <MdOutlineFileDownloadDone className={classes.saveChecked} />}
      <Form.Label>Url Of {boxName}*</Form.Label>
      <Form.Control
        type="text"
        placeholder="Url"
        required
        value={urlValue}
        onChange={urlChangeHandler}
        onBlur={submitHandler}
      />

      {urlHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Name.
        </Alert>
      )}
    </Form.Group>
  );
};

export default CreateSocials;
