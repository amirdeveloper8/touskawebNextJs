import { useState } from "react";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import useInput from "../../../hooks/use-input";
import { getData } from "../../../lib/get-data";

import classes from "./menu.module.css";

import { AiFillCheckSquare } from "react-icons/ai";

const isText = (value) => value.trim().length > 0;
const isUrl = (value) => value.trim().length > 0;

const CreateSubMenu = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(true);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isUrl);
  const {
    value: itemValue,
    isValid: itemIsValid,
    hasError: itemHasError,
    valueChangeHandler: itemChangeHandler,
    inputBlurHandler: itemBlurHandler,
    reset: resetItem,
  } = useInput(isText);

  const [checked, setChecked] = useState(false);
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

    setBoxName(val[1]);
    setTypeValue(+val[0]);
    console.log("value", typeValue);
  };

  const changeTypeUrl = () => {
    setUsePageId(!usePageId);
    setValueBox("open this");
    resetUrl();
  };

  const submitHandler = () => {
    if (!urlValue) {
      props.urlValues[props.number] = { id: typeValue };
      if (props.urlValues[props.number] === { id: typeValue }) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
    if (urlValue) {
      props.urlValues[props.number] = { url: urlValue };
      if (props.urlValues[props.number] === { url: urlValue }) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }

    props.nameValues[props.number] = itemValue;
    if (props.nameValues[props.number] === itemValue) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };
  return (
    <Row className={classes.subItems}>
      {checked && (
        <div className={classes.check}>
          <AiFillCheckSquare />
        </div>
      )}
      {usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>Select Page (sub {props.number + 1})*</Form.Label>
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
      {!usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
          onBlur={() => setChecked(false)}
        >
          <Form.Label>Custome Url*</Form.Label>
          <Form.Control
            type="Custome Url"
            placeholder="Custome Url"
            required
            value={urlValue}
            onChange={urlChangeHandler}
            onBlur={urlBlurHandler}
          />

          {urlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid Url (includes <b>http</b>).
            </Alert>
          )}
          <Badge className={classes.badge} onClick={changeTypeUrl}>
            Select From Pages
          </Badge>
        </Form.Group>
      )}
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={() => setChecked(false)}
      >
        <Form.Label>Name sub {props.number + 1}*</Form.Label>
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
      <Button
        className={classes.saveSub}
        onClick={submitHandler}
        variant="info"
      >
        save
      </Button>
    </Row>
  );
};

export default CreateSubMenu;
