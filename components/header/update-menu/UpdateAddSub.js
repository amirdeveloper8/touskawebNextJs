import useInput from "../../../hooks/use-input";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import { useState } from "react";

import classes from "./update-menu.module.css";

import { getData } from "../../../lib/get-data";

import { AiFillCheckSquare } from "react-icons/ai";

const isText = (value) => value.trim().length > 0;

const UpdateAddSub = (props) => {
  const [checked, setChecked] = useState(false);

  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(false);
  const [typeValue, setTypeValue] = useState();

  const item = props.item;

  const {
    value: itemValue,
    isValid: itemIsValid,
    hasError: itemHasError,
    valueChangeHandler: itemChangeHandler,
    inputBlurHandler: itemBlurHandler,
    reset: resetItem,
  } = useInput(isText);

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isText);

  const getPagesHandler = async () => {
    const data = await getData("getAllPage");
    const pageValues = data.pages;
    setMenuItems(pageValues);
    console.log(data);
    console.log(pageValues);
    setChecked(false);
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    setChecked(false);
    const val = value.split(".");
    setValueBox(value);

    setTypeValue(+val[0]);
    console.log("value", typeValue);
  };

  const changeTypeUrl = () => {
    setUsePageId(!usePageId);
    setValueBox("open this");
    resetUrl();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("ok");
    if (urlValue) {
      const value = { name: itemValue, url: urlValue };
      props.item[props.number] = value;
    }
    if (typeValue) {
      const value = { name: itemValue, page_id: typeValue };
      props.item[props.number] = value;
    }
    setChecked(true);
  };

  let formIsValid = false;

  if (itemValue && (urlValue || typeValue)) {
    formIsValid = true;
  }

  const url = !item.page_id ? item.url : item.page.url;
  return (
    <Row className={`${classes.subs} ${classes.control}`}>
      {checked && (
        <div className={classes.check}>
          <AiFillCheckSquare />
        </div>
      )}
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={() => setChecked(false)}
      >
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          required
          value={itemValue}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
      </Form.Group>
      {!usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
          onBlur={() => setChecked(false)}
        >
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Url"
            required
            value={urlValue}
            onChange={urlChangeHandler}
            onBlur={urlBlurHandler}
          />

          {urlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid Url.
            </Alert>
          )}

          <Badge className={classes.badge} onClick={changeTypeUrl}>
            Select from Pages
          </Badge>
        </Form.Group>
      )}
      {usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
          onBlur={() => setChecked(false)}
        >
          <Form.Label>Select Page*</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            onClick={getPagesHandler}
            aria-label="Default select example"
          >
            <option>Select Item ...</option>
            {menuItems.map((box) => (
              <option key={box.id} value={`${box.id}.${box.title}`}>
                {box.id}. {box.title}
              </option>
            ))}
          </Form.Select>
          <Badge className={classes.badge} onClick={changeTypeUrl}>
            Use Custome Url
          </Badge>
        </Form.Group>
      )}
      <Button
        onClick={submitHandler}
        className={classes.saveItem}
        variant="success"
        disabled={!formIsValid}
      >
        Save
      </Button>
    </Row>
  );
};

export default UpdateAddSub;
