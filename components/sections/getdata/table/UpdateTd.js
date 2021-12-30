import { Fragment, useState } from "react";
import { Button, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

import classes from "./table.module.css";

import { GrEdit } from "react-icons/gr";
import { AiFillCheckCircle } from "react-icons/ai";

import { BsCheckSquareFill } from "react-icons/bs";
import { BsCardText } from "react-icons/bs";
import { BsFillXSquareFill } from "react-icons/bs";

const isText = (value) => value.trim().length > 0;

const UpdateTd = (props) => {
  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.data);
  const [showInput, setShowInput] = useState(false);

  const editHandler = () => {
    setValue("");
    setEdit(true);
  };

  const tabBlurHandler = () => {
    setValue(tabValue);
  };

  const textValueHandler = () => {
    setValue(tabValue);
    setShowInput(true);
  };

  const trueValueHanler = () => {
    setValue("true");
    props.allValue[props.count] = value;
  };

  const falseValueHanler = () => {
    setValue("false");
    props.allValue[props.count] = value;
  };

  const submitEdit = () => {
    console.log(value);
    props.allValue[props.count] = value;
    setEdit(false);
  };

  return (
    <section>
      {!edit && (
        <div className={classes.inputTh}>
          {value === "true" && (
            <BsCheckSquareFill
              className={
                value !== "true"
                  ? `${classes.trueValue}`
                  : `${classes.trueValue} ${classes.selectedValue}`
              }
              // onClick={trueValueHanler}
            />
          )}

          {value !== "true" && value !== "false" && (
            <Form.Control
              type="text"
              placeholder={value}
              required
              value={edit ? tabValue : value}
              onChange={tabChangeHandler}
              onBlur={tabBlurHandler}
            />
          )}
          {value === "false" && (
            <BsFillXSquareFill
              className={
                value !== "false"
                  ? `${classes.falseValue}`
                  : `${classes.falseValue} ${classes.selectedValue}`
              }
              // onClick={falseValueHanler}
            />
          )}
          {!edit && (
            <GrEdit className={classes.iconThEdit} onClick={editHandler} />
          )}
          {edit && (
            <AiFillCheckCircle
              className={classes.iconThEdit}
              onClick={submitEdit}
            />
          )}
        </div>
      )}
      {edit && (
        <div className={classes.selectValue}>
          <div className={classes.inputTh}>
            <BsCheckSquareFill
              className={
                value !== "true"
                  ? `${classes.trueValue} ${classes.selector}`
                  : `${classes.trueValue} ${classes.selectedValue}`
              }
              onClick={trueValueHanler}
            />

            {!showInput && (
              <BsCardText
                onClick={textValueHandler}
                className={classes.selector}
              />
            )}
            {showInput && (
              <Form.Control
                type="text"
                placeholder={value}
                required
                value={edit ? tabValue : value}
                onChange={tabChangeHandler}
                onBlur={tabBlurHandler}
                className={classes.inputValue}
              />
            )}

            <BsFillXSquareFill
              className={
                value !== "false"
                  ? `${classes.falseValue} ${classes.selector}`
                  : `${classes.falseValue} ${classes.selectedValue}`
              }
              onClick={falseValueHanler}
            />

            {!edit && (
              <GrEdit className={classes.iconThEdit} onClick={editHandler} />
            )}
          </div>
          {edit && (
            <Button onClick={submitEdit} variant="success">
              save
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export default UpdateTd;
