import useInput from "../../../hooks/use-input";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import { useContext, useState } from "react";

import classes from "./update-menu.module.css";

import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";

import { getData } from "../../../lib/get-data";

import { AiFillCheckSquare } from "react-icons/ai";
import { ConnectToDB } from "../../../lib/connect-to-db";
import AuthContext from "../../../store/auth-context";
import axios from "axios";
import Notification from "../../ui/notification";

import Modal from "../../ui/Modal";

const isText = (value) => value.trim().length > 0;

const UpdateSubs = (props) => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();

  const [checked, setChecked] = useState(false);

  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(false);
  const [typeValue, setTypeValue] = useState();

  const [resetItemValue, setResetItemValue] = useState(false);
  const [resetUrlValue, setResetUrlValue] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const item = props.item;

  const {
    value: itemValue,
    isValid: itemIsValid,
    hasError: itemHasError,
    valueChangeHandler: itemChangeHandler,
    inputBlurHandler: itemBlurHandler,
    reset: resetItem,
  } = useInput(isText);

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isText);

  const resetItemHandler = () => {
    setResetItemValue(true);
  };

  const resetUrlHandler = () => {
    setResetUrlValue(true);
  };

  const getPagesHandler = async () => {
    const data = await getData("getAllPage");
    const pageValues = data.pages;
    setMenuItems(pageValues);
    console.log(data);
    console.log(pageValues);
    setChecked(false);
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    setChecked(false);
    const val = value.split(".");
    setValueBox(value);

    setTypeValue(+val[0]);
    console.log("value", typeValue);
  };

  const changeTypeUrl = () => {
    setUsePageId(!usePageId);
    setValueBox("open this");
    resetUrl();
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (itemValue) {
      props.subs[props.number].name = itemValue;
    }
    if (urlValue) {
      props.subs[props.number].url = urlValue;
      props.subs[props.number].page_id = "";
    }
    if (typeValue) {
      props.subs[props.number].url = "";
      props.subs[props.number].page_id = typeValue;
    }

    setChecked(true);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const deleteHandler = () => {
    setNotification("pending");
    const fData = new FormData();

    fData.append("id", props.id);

    const connectDB = ConnectToDB("delete/menu");

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
        console.log("res", res.data);
        if (res.data.status === "success deleted") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
        setdataError(err.response.data.status);
      });
  };

  let notifDetails;

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (notification === "success deleted") {
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

  let formIsValid = false;

  if (itemValue || urlValue || typeValue) {
    formIsValid = true;
  }

  const url = !item.page_id ? item.url : item.page.url;
  return (
    <Row className={`${classes.subs} ${classes.control}`}>
      <div className={classes.delIcon}>
        <MdDelete onClick={() => setShowDelete(true)} />
      </div>
      {checked && (
        <div className={classes.check}>
          <AiFillCheckSquare />
        </div>
      )}
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
        onBlur={() => setChecked(false)}
      >
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          required
          value={resetItemValue ? itemValue : item.name}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
        {!resetItemValue && (
          <AiFillEdit className={classes.edit} onClick={resetItemHandler} />
        )}
      </Form.Group>
      {!usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
          onBlur={() => setChecked(false)}
        >
          <Form.Label>Url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Url"
            required
            value={resetUrlValue ? urlValue : url}
            onChange={urlChangeHandler}
            onBlur={urlBlurHandler}
          />

          {urlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid Url.
            </Alert>
          )}
          {!resetUrlValue && (
            <AiFillEdit className={classes.edit} onClick={resetUrlHandler} />
          )}
          {resetUrlValue && (
            <Badge className={classes.badge} onClick={changeTypeUrl}>
              Select from Pages
            </Badge>
          )}
        </Form.Group>
      )}
      {resetUrlValue && usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
          onBlur={() => setChecked(false)}
        >
          <Form.Label>Select Page*</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            onClick={getPagesHandler}
            aria-label="Default select example"
          >
            <option>Select Item ...</option>
            {menuItems.map((box) => (
              <option key={box.id} value={`${box.id}.${box.title}`}>
                {box.id}. {box.title}
              </option>
            ))}
          </Form.Select>
          <Badge className={classes.badge} onClick={changeTypeUrl}>
            Use Custome Url
          </Badge>
        </Form.Group>
      )}
      <Button
        onClick={submitHandler}
        className={classes.saveItem}
        variant="success"
        disabled={!formIsValid}
      >
        Save
      </Button>
      {showDelete && (
        <Modal className={classes.modal}>
          <Row className={classes.deleteRow}>
            <Col lg={12}>
              <h3>Are You Sure ?</h3>
            </Col>
            <Col lg={6}>
              <Button variant="success" onClick={deleteHandler}>
                Yes
              </Button>
            </Col>
            <Col lg={6}>
              <Button variant="danger" onClick={() => setShowDelete(false)}>
                No
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </Row>
  );
};

export default UpdateSubs;
