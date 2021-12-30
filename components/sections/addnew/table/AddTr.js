import { useState } from "react";

import { BsSaveFill } from "react-icons/bs";
import classes from "./addtable.module.css";
import { Fragment } from "react";
import AddTd from "./AddTd";

const AddTr = (props) => {
  const [trValue, setTrValue] = useState([]);

  const getTrValue = (th) => {
    setTrValue([...trValue, th]);
  };
  let td = [];
  for (let i = 0; i < props.columnsCount; i++) {
    td[i] = (
      <AddTd
        key={i}
        numberColumn={props.numberColumn}
        numberRow={i + 1}
        columnsCount={props.columnsCount}
        getTrValue={getTrValue}
        trValue={trValue}
      />
    );
  }
  const submitHandler = () => {
    console.log(trValue);
    if (!props.getRow[+props.numberColumn - 1]) {
      props.getRowHandler(trValue);
    } else {
      props.getRow[+props.numberColumn - 1] = trValue;
    }
  };
  return (
    <tr
      onBlur={submitHandler}
      onClick={submitHandler}
      className={classes.trForm}
    >
      {td}
      {/* <BsSaveFill className={classes.saveRow} onClick={submitHandler} /> */}
    </tr>
  );
};

export default AddTr;
