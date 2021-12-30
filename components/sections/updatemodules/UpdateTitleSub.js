import { Fragment, useContext, useState } from "react";
import { Badge, Form, Row } from "react-bootstrap";
import useInput from "../../../hooks/use-input";

import classes from "./update.module.css";

import { BiEdit } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { ConnectToDB } from "../../../lib/connect-to-db";

const isText = (value) => value.trim().length > 0;

const UpdateTitleSub = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: subValue,
    isValid: subIsValid,
    hasError: subHasError,
    valueChangeHandler: subChangeHandler,
    inputBlurHandler: subBlurHandler,
    reset: resetSub,
  } = useInput(isText);

  const secId = props.data.id;
  const titleOld = props.data.title;
  const subOld = props.data.subtitle;

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editSub, setEditSub] = useState(false);
  const [value, setValue] = useState(props.data);

  const editHandler = () => {
    setEdit(true);
    console.log(titleOld);
  };

  const submitEdit = () => {
    setValue(titleValue);
    console.log(value);
    const fData = new FormData();
    fData.append("id", secId);

    {
      titleValue && fData.append("title", titleValue);
    }
    {
      subValue && fData.append("subtitle", subValue);
    }

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
    <div className={classes.inputTitle}>
      {!edit && (
        <div>
          <h3>Title : {titleOld}</h3>
          <h5>{subOld}</h5>
        </div>
      )}
      {edit && (
        <Form>
          <Form.Group as={Row} className={classes.formGroup}>
            <Form.Label>Title :</Form.Label>
            <Form.Control
              type="text"
              placeholder={value}
              required
              value={titleOld}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />
            {!editTitle && (
              <Badge
                className={classes.editTitleSub}
                onClick={() => setEditTitle(true)}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
          <Form.Group as={Row} className={classes.formGroup}>
            <Form.Label>Sub :</Form.Label>
            <Form.Control
              type="text"
              as="textarea"
              placeholder={subOld}
              required
              value={editSub ? subValue : subOld}
              onChange={subChangeHandler}
              onBlur={subBlurHandler}
            />
            {!editSub && (
              <Badge
                className={classes.editTitleSub}
                onClick={() => setEditSub(true)}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Form>
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

export default UpdateTitleSub;
