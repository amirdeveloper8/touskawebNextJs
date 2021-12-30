import { Fragment, useContext, useState } from "react";
import { Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

import classes from "./table.module.css";

import { BiEdit } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";
import { ConnectToDB } from "../../../../lib/connect-to-db";

const isText = (value) => value.trim().length > 0;

const GetTitlesTable = (props) => {
  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    valueChangeHandler: tabChangeHandler,
    reset: resetTab,
  } = useInput(isText);

  const tableId = props.tableId;

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(props.data);

  const editHandler = () => {
    setEdit(true);
  };

  const tabBlurHandler = () => {
    setValue(tabValue);
    console.log(tabValue);
  };

  const submitEdit = () => {
    setValue(tabValue);
    console.log(value);
    const fData = new FormData();
    fData.append("table_id", tableId);
    if (props.type === "titleHeader") {
      fData.append("titleHeader", tabValue);
    }
    if (props.type === "titleFooter") {
      fData.append("titleFooter", tabValue);
    }

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
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });
  };

  const cancelEdit = () => {
    setValue(props.data);
    setEdit(false);
  };

  return (
    <div className={`${classes.inputTh} ${classes.inputTitle}`}>
      <Form.Control
        type="text"
        placeholder={value}
        required
        value={edit ? tabValue : value}
        onChange={tabChangeHandler}
        onBlur={tabBlurHandler}
      />
      <Form.Label>
        {props.type === "titleHeader" ? "Title Header :" : "Title Footer :"}
      </Form.Label>
      {!edit && <BiEdit onClick={editHandler} />}
      {edit && <BsCheck onClick={submitEdit} />}
      {edit && (
        <RiCloseCircleFill
          className={classes.cancelIcon}
          onClick={cancelEdit}
        />
      )}
    </div>
  );
};

export default GetTitlesTable;
