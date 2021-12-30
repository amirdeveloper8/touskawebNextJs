import { Button, CloseButton, Form, Nav, Table } from "react-bootstrap";

import classes from "./table.module.css";
import { BiEdit } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import { useContext, useState } from "react";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";
import UpdateTh from "./UpdateTh";

const isText = (value) => value.trim().length > 0;

const GetTf = (props) => {
  const tableId = props.tableId;
  const data = props.data;
  const number = props.number;
  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;
  const widthStyle = 100 / data.length;

  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    inputBlurHandler: tabBlurHandler,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  let allValue = [];
  let ths = [];
  for (let i = 0; i < data.length; i++) {
    allValue[i] = data[i];
  }
  for (let i = 0; i < allValue.length; i++) {
    ths[i] = (
      <th style={{ width: `${widthStyle}%` }} key={i}>
        <UpdateTh data={allValue[i]} number={i} allValue={allValue} />
      </th>
    );
  }

  const [update, setUpdate] = useState(false);
  const updateHandler = () => {
    setUpdate(true);
    console.log(allValue);
  };

  const closeInputHandler = () => {
    setUpdate(false);
    console.log(allValue);
  };

  let btnValid = false;

  if (tabIsValid) {
    btnValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("tf", JSON.stringify(allValue));

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

    console.log(JSON.stringify(allValue));
  };

  return (
    <section className={classes.header}>
      <Table striped bordered hover>
        {!update && (
          <thead className={classes.tableValues}>
            <tr>
              {data.map((item, index) => (
                <th style={{ width: `${widthStyle}%` }} key={index}>
                  {item}
                </th>
              ))}
              <th className={classes.editHeader}>
                <BiEdit onClick={updateHandler} />
              </th>
            </tr>
          </thead>
        )}
        {update && (
          <thead className={classes.tableValues}>
            <tr>
              {ths}
              <th className={classes.editHeader}>
                <BsCheck onClick={submitHandler} />
              </th>
              <th className={classes.closeTh}>
                <RiCloseCircleFill onClick={closeInputHandler} />
              </th>
            </tr>
          </thead>
        )}
      </Table>
    </section>
  );
};

export default GetTf;
