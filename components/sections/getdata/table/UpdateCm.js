import { Fragment, useState } from "react";
import { Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

import classes from "./table.module.css";

import { GrEdit } from "react-icons/gr";
import { AiFillCheckCircle } from "react-icons/ai";

const isText = (value) => value.trim().length > 0;

const UpdateCm = (props) => {
  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.data);

  const editHandler = () => {
    setEdit(true);
  };

  const tabBlurHandler = () => {
    setValue(tabValue);
  };

  const submitEdit = () => {
    setValue(tabValue);
    console.log(value);
    props.allValue[props.number] = value;
    setEdit(false);
  };

  return (
    <div className={classes.inputTh}>
      <Form.Control
        type="text"
        as="textarea"
        placeholder={value}
        required
        value={edit ? tabValue : value}
        onChange={tabChangeHandler}
        onBlur={tabBlurHandler}
      />
      {!edit && <GrEdit onClick={editHandler} />}
      {edit && <AiFillCheckCircle onClick={submitEdit} />}
    </div>
  );
};

export default UpdateCm;
