import { useState } from "react";
import classes from "../create.module.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import ThForms from "./ThForm";
import TdForms from "./TdForm";
import useInput from "../../../../hooks/use-input";

import { GoDiffAdded } from "react-icons/go";
import { GoDiffRemoved } from "react-icons/go";
import TrForm from "./TrForm";

const isText = (value) => value.trim().length > 0;
const TablesForm = (props) => {
  const [countRow, setCountRow] = useState(4);

  const [getRow, setgetRow] = useState([]);
  const getRowHandler = (row) => {
    setgetRow([...getRow, row]);
  };

  let th = [];
  let tr = [];
  let td = [];
  let tdValues = [];
  for (let i = 0; i < props.columnsCount; i++) {
    th[i] = <ThForms number={i + 1} key={i} />;
    td[i] = [i + 1];
  }
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

  return (
    <section className={classes.table}>
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
      </div>
      <Table striped bordered hover>
        <tbody>{tr}</tbody>
      </Table>
    </section>
  );
};

export default TablesForm;
