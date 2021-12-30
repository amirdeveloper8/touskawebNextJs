import { useState, useContext } from "react";
import classes from "../create.module.css";
import { Button, Col, Form, Nav, Row, Table, Tab } from "react-bootstrap";
import ThForms from "./ThForm";
import TdForms from "./TdForm";
import useInput from "../../../../hooks/use-input";

import { MdFullscreenExit } from "react-icons/md";
import { MdFullscreen } from "react-icons/md";
import TabForms from "./TabForm";
import ContentForm from "./ContentForm";
import { Fragment } from "react";
import AuthContext from "../../../../store/auth-context";

const isText = (value) => value.trim().length > 0;
const InfoForm = (props) => {
  const [countsColumn, setCountsColumn] = useState(props.columnsCount);
  const [countRow, setCountRow] = useState(2);
  const [showSec, setShowSec] = useState(true);

  const [getRow, setGetRow] = useState([]);
  const [getTab, setGetTab] = useState([]);

  const authCtx = useContext(AuthContext);
  const saveTable = authCtx.saveTableHandler;

  const getRowHandler = (row) => {
    setGetRow([...getRow, row]);
  };

  const getTabHandler = (tab) => {
    setGetTab([...getTab, tab]);
  };

  let th = [];
  let tr = [];
  let td = [];

  let tabs = [];
  let content = [];

  for (let i = 0; i < props.tabsCount; i++) {
    tabs[i] = (
      <TabForms
        getTab={getTab}
        getTabHandler={getTabHandler}
        key={i}
        tab={i + 1}
      />
    );
  }

  for (let i = 0; i < props.tabsCount; i++) {
    content[i] = (
      <ContentForm
        getRow={getRow}
        getRowHandler={getRowHandler}
        columnsCount={props.columnsCount}
        key={i}
        tab={i + 1}
      />
    );
  }

  let formIsValid = false;
  console.log("getRow.length", getTab.length);

  if (getRow.length === props.tabsCount && getTab.length === props.tabsCount) {
    formIsValid = true;
  }

  const submitRowHandler = () => {
    console.log("getRow", getRow, getRow.length);
    console.log("getTab", getTab, getTab.length);
    props.getTitles(getTab);
    props.getRows(getRow);
    saveTable();
    // if (!props.getRow[+props.numberColumn - 1]) {
    //   props.getRowHandler(getRow);
    // } else {
    //   props.getRow[+props.numberColumn - 1] = getRow;
    // }
  };

  const closeSec = () => {
    setShowSec(false);
  };

  const openSec = () => {
    setShowSec(true);
  };

  return (
    <Fragment>
      <section className={classes.table}>
        <div className={classes.triggerSec}>
          {showSec && <MdFullscreenExit onClick={closeSec} />}
          {!showSec && <MdFullscreen onClick={openSec} />}
        </div>
        <Tab.Container defaultActiveKey="tab1">
          <Row className={!showSec ? classes.dNone : ""}>
            <Col sm={12}>
              <Nav className={classes.navTabs} variant="tabs">
                {tabs}
              </Nav>
            </Col>
            <Col sm={12}>
              <Tab.Content>{content}</Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
        <Col className="text-center">
          <Button className={classes.saveTable} onClick={submitRowHandler}>
            Save table
          </Button>
        </Col>
      </section>
    </Fragment>
  );
};

export default InfoForm;
