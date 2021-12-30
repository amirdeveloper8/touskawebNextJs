import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert, Table } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import Notification from "../../../ui/notification";
import TablesForm from "./TablesForm";
import InfoForm from "./InfoForm";
import ThForms from "./ThForm";
import TfForm from "./TfForm";
import CommentForm from "./commentForm";

import { MdOutlineAddComment } from "react-icons/md";
import { BiCommentMinus } from "react-icons/bi";

const isText = (value) => value.trim().length > 0;
const CreateTable = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);
  const {
    value: btnNameValue,
    isValid: btnNameIsValid,
    hasError: btnNameHasError,
    valueChangeHandler: btnNameChangeHandler,
    inputBlurHandler: btnNameBlurHandler,
    reset: resetBtnName,
  } = useInput(isText);
  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
    reset: resetBtnUrl,
  } = useInput(isText);

  const {
    value: tableTitleValue,
    isValid: tableTitleIsValid,
    hasError: tableTitleHasError,
    valueChangeHandler: tableTitleChangeHandler,
    inputBlurHandler: tableTitleBlurHandler,
    reset: resetTableTitle,
  } = useInput(isText);
  const {
    value: tableFooterValue,
    isValid: tableFooterIsValid,
    hasError: tableFooterHasError,
    valueChangeHandler: tableFooterChangeHandler,
    inputBlurHandler: tableFooterBlurHandler,
    reset: resetTableFooter,
  } = useInput(isText);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [tabsCount, setTabsCount] = useState(1);
  const [columnsCount, setColumnsCount] = useState(4);
  const [commentsCount, setCommentsCount] = useState(2);
  const [titles, setTitles] = useState([]);
  const [thValues, setThValues] = useState([]);
  const [tfValues, setTfValues] = useState([]);
  const [cmValues, setCmValues] = useState([]);
  const [Rows, setRows] = useState([]);
  let sliders = [];

  const increaseCms = () => {
    setCommentsCount(commentsCount + 1);
  };

  const decreaseCms = () => {
    if (commentsCount > 0) {
      setCommentsCount(commentsCount - 1);
    }
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const saveTable = authCtx.saveTable;

  const getTitles = (title) => {
    setTitles(title);
  };

  const getThs = (th) => {
    setThValues([...thValues, th]);
  };

  const getTfs = (tf) => {
    setTfValues([...tfValues, tf]);
  };

  const getCms = (cm) => {
    setCmValues([...cmValues, cm]);
  };

  const getRows = (row) => {
    setRows(row);
  };

  const tabsNumberHandleChange = (e) => {
    setTabsCount(e.target.value);
  };

  const columnsNumberHandleChange = (e) => {
    setColumnsCount(e.target.value);
  };
  for (var i = 0; i < tabsCount; i++) {
    sliders[i] = [i + 1];
  }

  let th = [];

  for (var i = 0; i < columnsCount; i++) {
    th[i] = (
      <ThForms getThs={getThs} thValues={thValues} key={i} number={i + 1} />
    );
  }

  let tf = [];

  for (var i = 0; i < columnsCount; i++) {
    tf[i] = (
      <TfForm getTfs={getTfs} tfValues={tfValues} key={i} number={i + 1} />
    );
  }

  let cm = [];

  for (var i = 0; i < commentsCount; i++) {
    cm[i] = (
      <CommentForm getCms={getCms} cmValues={cmValues} key={i} number={i + 1} />
    );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();
    fData.append("page_id", props.pageId);
    fData.append("title", titleValue);
    fData.append("button_name", btnNameValue);
    fData.append("button_url", btnUrlValue);
    fData.append("type_id", 8);
    fData.append("comments", JSON.stringify(cmValues));
    fData.append("titleHeader", tableTitleValue);
    fData.append("titleFooter", tableFooterValue);
    fData.append("th", JSON.stringify(thValues));
    fData.append("tf", JSON.stringify(tfValues));

    for (var i = 0; i < tabsCount; i++) {
      fData.append(`tab_title_${i + 1}`, titles[i]);
      fData.append(`tab_tr_${i + 1}`, JSON.stringify(Rows[i]));
    }

    const connectDB = ConnectToDB("create/section/table");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        if (res.data.status === "success created") {
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
            props.getData();
          }, 2000);
          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeTableSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
      });
  };

  let formIsValid = false;

  if (titleIsValid && btnNameIsValid && btnUrlIsValid && saveTable) {
    formIsValid = true;
  }

  let notifDetails;

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (notification === "success created") {
    notifDetails = {
      status: "success",
      title: "Success!",
      message: "Message sent successfully!",
    };
  }

  if (notification === "error") {
    notifDetails = {
      status: "error",
      title: "Error!",
      message: dataError,
    };
  }
  return (
    <div className={classes.sliders}>
      <Form onSubmit={submitHandler}>
        <Row className={classes.controlFirstForm}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Number of Tabs</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Number of Tabs"
              required
              value={tabsCount}
              onChange={tabsNumberHandleChange}
            />
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Number of Columns</Form.Label>
            <Form.Control
              type="number"
              min={1}
              placeholder="Number of Columns"
              required
              value={columnsCount}
              onChange={columnsNumberHandleChange}
            />
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              required
              value={titleValue}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button Name"
              required
              value={btnNameValue}
              onChange={btnNameChangeHandler}
              onBlur={btnNameBlurHandler}
            />

            {btnNameHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Name.
              </Alert>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Button Url*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Button Url"
              required
              value={btnUrlValue}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Button Url.
              </Alert>
            )}
          </Form.Group>
        </Row>

        <div className={`${classes.actions} ${classes.submitactions}`}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      <div className={classes.tablesForm}>
        <Row className={classes.headTable}>
          <Col sm={12} className="w-25">
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Label>Table Title*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Table Title"
                required
                value={tableTitleValue}
                onChange={tableTitleChangeHandler}
                onBlur={tableTitleBlurHandler}
              />

              {titleHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Name.
                </Alert>
              )}
            </Form.Group>
          </Col>
          <Col className={classes.theadTable} sm={12}>
            <Table striped bordered hover>
              <thead>
                <tr>{th}</tr>
              </thead>
            </Table>
          </Col>
        </Row>
        <InfoForm
          tabsCount={tabsCount}
          columnsCount={columnsCount}
          Rows={Rows}
          getRows={getRows}
          getTitles={getTitles}
        />
        <Row className={classes.headTable}>
          <Col sm={12} className="w-25">
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Label>Footer Title*</Form.Label>
              <Form.Control
                type="text"
                placeholder="footer Title"
                required
                value={tableFooterValue}
                onChange={tableFooterChangeHandler}
                onBlur={tableFooterBlurHandler}
              />

              {titleHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Name.
                </Alert>
              )}
            </Form.Group>
          </Col>
          <Col className={classes.theadTable} sm={12}>
            <Table striped bordered hover>
              <thead>
                <tr>{tf}</tr>
              </thead>
            </Table>
          </Col>
        </Row>

        <Row className={classes.commentTable}>
          <h2 className="text-left">Comments</h2>
          <div className={classes.countCms}>
            <BiCommentMinus onClick={decreaseCms} />
            <MdOutlineAddComment onClick={increaseCms} />
          </div>

          <div className={classes.inputsComment}>{cm}</div>
        </Row>
      </div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </div>
  );
};

export default CreateTable;
