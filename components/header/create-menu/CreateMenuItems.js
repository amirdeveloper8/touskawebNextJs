import { useState } from "react";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import useInput from "../../../hooks/use-input";
import { getData } from "../../../lib/get-data";

import Modal from "../../ui/Modal";

import classes from "./menu.module.css";

import { AiFillCheckSquare } from "react-icons/ai";
import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";
import { BiDownArrow } from "react-icons/bi";
import { BiUpArrow } from "react-icons/bi";
import CreateSubMenu from "./CreateSubMenu";

const isText = (value) => value.trim().length > 0;
const isUrl = (value) => value.trim().length > 0;

const CreateMenuItems = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(true);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  const [subCount, setSubCount] = useState(false);
  const [urlValues, setUrlValues] = useState([]);
  const [nameValues, setNameValues] = useState([]);
  const [itemsDisplay, setItemsDisplay] = useState(true);

  let items = [];
  for (let i = 0; i < subCount; i++) {
    items[i] = (
      <CreateSubMenu
        urlValues={urlValues}
        nameValues={nameValues}
        key={i}
        number={i}
      />
    );
  }

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

  let subs = [];

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

    for (let i = 0; i < subCount; i++) {
      if (urlValues[i].url) {
        subs[i] = {
          url: urlValues[i].url,
          name: nameValues[i],
        };
      }
      if (urlValues[i].id) {
        subs[i] = {
          page_id: urlValues[i].id,
          name: nameValues[i],
        };
      }
      props.subValues[props.number] = subs;
    }

    console.log("urlValues", urlValues);
    console.log("nameValues", nameValues);
    console.log("ssss", subs);
  };
  return (
    <Row className={classes.control}>
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
              Please enter a valid Url .
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
        <Form.Label>Name*</Form.Label>
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

      <Row className={classes.addSubs}>
        <Col lg={12}>
          <h4 variant="info">add Subs ?</h4>
        </Col>
        {subCount && (
          <Col className={classes.iconDisplay} lg={12}>
            {!itemsDisplay && (
              <BiDownArrow onClick={() => setItemsDisplay(true)} />
            )}
            {itemsDisplay && (
              <BiUpArrow onClick={() => setItemsDisplay(false)} />
            )}
          </Col>
        )}
        {!subCount && (
          <Col lg={12}>
            <Button onClick={() => setSubCount(1)}>Yes</Button>
          </Col>
        )}
        {subCount && (
          <div className={itemsDisplay ? "w-100" : "d-none"}>{items}</div>
        )}
        {subCount && itemsDisplay && (
          <Col className={classes.iconSubs} lg={12}>
            <AiFillPlusSquare
              onClick={() => {
                setSubCount(subCount + 1);
              }}
            />
            <AiFillMinusSquare
              onClick={() => {
                setSubCount(subCount - 1);
              }}
            />
          </Col>
        )}
        {subCount && (
          <Col lg={12}>
            <Button variant="danger" onClick={() => setSubCount(false)}>
              Cancel
            </Button>
          </Col>
        )}
      </Row>
      <Button
        className={classes.saveItem}
        onClick={submitHandler}
        variant="success"
      >
        save
      </Button>
    </Row>
  );
};

export default CreateMenuItems;
