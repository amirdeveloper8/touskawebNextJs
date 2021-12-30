import { Form, Nav, Alert, Button } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../create.module.css";

import { AiFillCheckCircle } from "react-icons/ai";
import { useState } from "react";

const isText = (value) => value.trim().length > 0;
const TabForms = (props) => {
  const [save, setSave] = useState(false);
  const [check, setCheck] = useState(false);
  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    inputBlurHandler: tabBlurHandler,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  const submitHandler = () => {
    console.log(tabValue);
    if (!props.getTab[+props.tab - 1]) {
      props.getTabHandler(tabValue);
    } else {
      props.getTab[+props.tab - 1] = tabValue;
    }
    setSave(false);
    setCheck(true);
  };

  const saveHandler = () => {
    setSave(true);
    setCheck(false);
  };
  return (
    <Nav.Item>
      <Nav.Link className={classes.tabInput} eventKey={`tab${props.tab}`}>
        <Form.Label className="text-center w-100">
          {tabValue ? `${tabValue}` : `Tab${props.tab}`}*
        </Form.Label>
        <Form.Control
          type="text"
          placeholder={`Tab ${props.tab}`}
          required
          value={tabValue}
          onChange={tabChangeHandler}
          onBlur={tabBlurHandler}
          onClick={saveHandler}
        />
        {tabHasError && <Alert variant="danger">required!</Alert>}
        {check && <AiFillCheckCircle />}
        {save && <Button onClick={submitHandler}>save</Button>}
      </Nav.Link>
    </Nav.Item>
  );
};

export default TabForms;
