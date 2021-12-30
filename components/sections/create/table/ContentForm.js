import { useState } from "react";
import { Button, Col, Row, Tab, Table } from "react-bootstrap";
import classes from "../create.module.css";
import TablesForm from "./TablesForm";
import TrForm from "./TrForm";

import { GoDiffAdded } from "react-icons/go";
import { GoDiffRemoved } from "react-icons/go";

const ContentForm = (props) => {
  const [getRow, setGetRow] = useState([]);
  const [countRow, setCountRow] = useState(4);

  const getRowHandler = (row) => {
    setGetRow([...getRow, row]);
  };

  let th = [];
  let tr = [];
  let td = [];
  let tdValues = [];

  for (let i = 0; i < countRow; i++) {
    tr[i] = (
      <TrForm
        getRow={getRow}
        getRowHandler={getRowHandler}
        columnsCount={props.columnsCount}
        numberColumn={i + 1}
        key={i}
      />
    );
  }

  const increaseRowHandler = () => {
    setCountRow(countRow + 1);
  };

  const decreaseRowHandler = () => {
    setCountRow(countRow - 1);
  };

  const submitHandler = () => {
    console.log(getRow);
    if (!props.getRow[+props.tab - 1]) {
      props.getRowHandler(getRow);
    } else {
      props.getRow[+props.tab - 1] = getRow;
    }
  };
  return (
    <Tab.Pane eventKey={`tab${props.tab}`}>
      <div className={classes.counts}>
        <Row className={classes.count}>
          <h5>#Rows</h5>
          <Col className={classes.addForTable} onClick={increaseRowHandler}>
            <GoDiffAdded />
          </Col>
          <Col className={classes.removeForTable} onClick={decreaseRowHandler}>
            <GoDiffRemoved />
          </Col>
        </Row>
        <h2>table {props.tab}</h2>
      </div>
      <Table striped bordered hover>
        <tbody onBlur={submitHandler}>{tr}</tbody>
      </Table>
    </Tab.Pane>
  );
};

export default ContentForm;
