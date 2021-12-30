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

const UpdateTable = (props) => {
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
    fData.append("id", tableId);

    fData.append("title", tabValue);

    const connectDB = ConnectToDB("update/sections");

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
            props.getData();
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
    <div className={`${classes.inputTitle} ${classes.updateTitle}`}>
      {!edit && <h3>Title : {props.data}</h3>}
      {edit && (
        <div>
          <Form.Label>Title :</Form.Label>
          <Form.Control
            type="text"
            placeholder={value}
            required
            value={edit ? tabValue : value}
            onChange={tabChangeHandler}
            onBlur={tabBlurHandler}
          />
        </div>
      )}
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

export default UpdateTable;
