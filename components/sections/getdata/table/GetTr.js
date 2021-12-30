import { Fragment } from "react";
import { Table, Tab } from "react-bootstrap";

import { BsCheckSquareFill } from "react-icons/bs";
import { BsFillXSquareFill } from "react-icons/bs";

import classes from "./table.module.css";
import UpdateTd from "./UpdateTd";

const GetTable = (props) => {
  const tableId = props.tableId;
  const data = props.data;
  const number = props.count;
  const trLength = data.length;
  const widthStyle = 100 / trLength;

  let tds = [];
  let tdValues = [];

  const getValues = () => {
    props.allValue[props.count] = tdValues;
    console.log(tdValues);
  };

  for (let i = 0; i < trLength; i++) {
    tdValues[i] = data[i];
    tds[i] = (
      <td
        className={classes.tdUpdate}
        onClick={getValues}
        style={{ width: `${widthStyle}%` }}
        key={i}
      >
        <UpdateTd data={tdValues[i]} allValue={tdValues} count={i} />
      </td>
    );
  }
  console.log("tds", tds);
  return <Fragment>{tds}</Fragment>;
};

export default GetTable;
