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
import UpdateCm from "./UpdateCm";

const isText = (value) => value.trim().length > 0;

const GetCms = (props) => {
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
      <li key={i}>
        <UpdateCm data={allValue[i]} number={i} allValue={allValue} />
      </li>
    );
  }

  const [update, setUpdate] = useState(false);
  const updateHandler = () => {
    setUpdate(true);
    console.log(allValue);
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

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("comments", JSON.stringify(allValue));

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
    <ul className={classes.comments}>
      {!update && (
        <div>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
          <div className={classes.editHeader}>
            <BiEdit onClick={updateHandler} />
          </div>
        </div>
      )}
      {update && (
        <div>
          {ths}
          <div className={classes.editHeader}>
            <BsCheck onClick={submitHandler} />
          </div>
          <div className={classes.closeTh}>
            <RiCloseCircleFill onClick={closeInputHandler} />
          </div>
        </div>
      )}
    </ul>
  );
};

export default GetCms;
