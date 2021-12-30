import { Fragment, useContext, useState } from "react";
import { Alert, Badge, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";

import classes from "./update-contact-head.module.css";

import { BiEdit } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";
import { ConnectToDB } from "../../../../lib/connect-to-db";

const isText = (value) => value.trim().length > 0;

const UpdateEmailContactForm = (props) => {
  const { id } = props.data;
  const emailAction = props.data.eamilaction[0].emailaction;
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  const editHandler = () => {
    setEdit(true);
  };

  const submitEdit = () => {
    const fData = new FormData();
    fData.append("section_id", id);

    {
      editTitle && fData.append("emailaction", titleValue);
    }

    const connectDB = ConnectToDB("update/emailaction");

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
    setEdit(false);
  };

  return (
    <div className={`${classes.inputTitle} ${classes.updateTitle}`}>
      {!edit && (
        <div>
          <h3>Email: {emailAction}</h3>
        </div>
      )}
      {edit && (
        <Form>
          <Form.Group className={classes.fromGp}>
            <Form.Label>Email :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              required
              value={editTitle ? titleValue : emailAction}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />
            {titleHasError && editTitle && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Email.
              </Alert>
            )}
            {!editTitle && (
              <Badge
                className={classes.edit}
                onClick={() => setEditTitle(true)}
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Form>
      )}
      {!edit && <BiEdit className={classes.submitIcon} onClick={editHandler} />}
      {edit && <BsCheck className={classes.submitIcon} onClick={submitEdit} />}
      {edit && (
        <RiCloseCircleFill
          className={classes.cancelIcon}
          onClick={cancelEdit}
        />
      )}
    </div>
  );
};

export default UpdateEmailContactForm;
