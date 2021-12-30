import { Button, CloseButton, Form, Nav, Alert } from "react-bootstrap";

import classes from "./table.module.css";
import { BiEdit } from "react-icons/bi";
import { useContext, useState } from "react";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";

const isText = (value) => value.trim().length > 0;

const GetTabs = (props) => {
  const tableId = props.tableId;
  const data = props.data;
  const number = props.number;
  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  console.log("tableId", tableId);

  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    inputBlurHandler: tabBlurHandler,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  const [update, setUpdate] = useState(false);

  const updateHandler = () => {
    setUpdate(true);
  };

  const closeInputHandler = () => {
    setUpdate(false);
  };

  let btnValid = false;

  if (tabIsValid) {
    btnValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    console.log(data.id, tableId, tabValue);

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("tab_id", data.id);
    fData.append("tab_title", tabValue);

    const connectDB = ConnectToDB("update/table");

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
        console.log("res", res);
        if (res.data.status === "success updated") {
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 800);

          setTimeout(() => {
            authCtx.showPageHandler();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });

    console.log(fData);
  };

  return (
    <Nav.Item className={classes.navItem}>
      {!update && (
        <Nav.Link eventKey={`table${number}`}>
          {data.title}
          <BiEdit className={classes.edit} onClick={updateHandler} />
        </Nav.Link>
      )}
      {update && (
        <Nav.Link eventKey={`table${number}`}>
          <Form>
            <Form.Label className="text-center w-100">
              Tab{props.number}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder={data.title}
              required
              value={tabValue}
              onChange={tabChangeHandler}
              onBlur={tabBlurHandler}
            />
            {tabHasError && <Alert variant="danger">required!</Alert>}
            <CloseButton
              className={classes.close}
              onClick={closeInputHandler}
            />
            <Button
              disabled={!btnValid}
              className={classes.saveTab}
              variant="success"
              onClick={submitHandler}
            >
              save
            </Button>
          </Form>
        </Nav.Link>
      )}
    </Nav.Item>
  );
};

export default GetTabs;
