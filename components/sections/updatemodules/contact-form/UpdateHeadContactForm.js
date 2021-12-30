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
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdateHeadContactForm = (props) => {
  const { title, subtitle, photo_url, id } = props.data;
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const {
    value: subtitleValue,
    isValid: subtitleIsValid,
    hasError: subtitleHasError,
    valueChangeHandler: subtitleChangeHandler,
    inputBlurHandler: subtitleBlurHandler,
    reset: resetSubtitle,
  } = useInput(isText);

  const tableId = props.tableId;

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editSubtitle, setEditSubtitle] = useState(false);
  const [editImage, setEditImage] = useState(false);
  const [value, setValue] = useState(props.data);
  const [selectedFile, setSelectedFile] = useState();

  const editHandler = () => {
    setEdit(true);
  };

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const submitEdit = () => {
    console.log("id", id);

    {
      editTitle && console.log("title", titleValue);
    }
    {
      editImage && console.log("image", selectedFile);
    }
    const fData = new FormData();
    fData.append("id", id);

    {
      editTitle && fData.append("title", titleValue);
    }
    {
      editImage && fData.append("image", selectedFile);
    }
    {
      editSubtitle && fData.append("subtitle", subtitleValue);
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
    <div className={`${classes.inputTitle} ${classes.updateTitle}`}>
      {!edit && (
        <div>
          <h3>Title: {title}</h3>
          <p>subtitle: {subtitle}</p>
          <Image width={600} height={770} alt={title} src={photo_url} />
        </div>
      )}
      {edit && (
        <Form>
          <Form.Group className={classes.fromGp}>
            <Form.Label>Title :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              required
              value={editTitle ? titleValue : title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />
            {titleHasError && editTitle && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
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
          <Form.Group className={classes.fromGp}>
            <Form.Label>Subtitle :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Subtitle"
              required
              value={editSubtitle ? subtitleValue : subtitle}
              onChange={subtitleChangeHandler}
              onBlur={subtitleBlurHandler}
            />
            {subtitleHasError && editSubtitle && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
            {!editSubtitle && (
              <Badge
                className={classes.edit}
                onClick={() => setEditSubtitle(true)}
              >
                edit
              </Badge>
            )}
          </Form.Group>
          <Form.Group className={`${classes.fromGp} mt-3 w-100`}>
            {!editImage && (
              <Image
                width={600}
                height={770}
                className="w-100"
                alt={title}
                src={photo_url}
              />
            )}
            {editImage && <Form.Label className="text-left">Image:</Form.Label>}
            {editImage && (
              <Form.Control
                lg={12}
                required
                name="image"
                id="image"
                type="file"
                onChange={(e) => handleChange(e.target.files)}
                size="sm"
              />
            )}
            {!editImage && (
              <Badge
                className={classes.edit}
                onClick={() => setEditImage(true)}
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

export default UpdateHeadContactForm;
