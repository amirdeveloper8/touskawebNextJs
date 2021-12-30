import { Fragment, useContext, useState } from "react";
import { Alert, Badge, Col, Form, Row } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../update.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { getData } from "../../../../lib/get-data";
import Notification from "../../../ui/notification";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const UpdateContactItems = (props) => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  const [types, setTypes] = useState([]);

  const [resetTypeSocial, setResetTypeSocial] = useState(false);
  const [resetUrl, setResetUrl] = useState(false);
  const [resetName, setResetName] = useState(false);

  const typeType = props.data.type.type;
  const typeName = props.data.type.name;
  const url = props.data.url;
  const name = props.data.name;
  const socialId = props.data.id;

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);
  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
  } = useInput(isText);

  const resetUrlHandler = () => {
    setResetUrl(true);
  };

  const resetNameHandler = () => {
    setResetName(true);
  };

  const resetTypeSocialHandler = async () => {
    const socialDetails = await getData("get/contactform/typeSocial");
    setTypes(socialDetails.typeSocial);

    setResetTypeSocial(true);
  };

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);
    console.log(valueBox);
    setChecked(false);

    setBoxName(val[1]);
    setTypeValue(val[2]);
  };

  let boxId = 0;

  const submitHandler = () => {
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];
    setBoxName(boxVal[1]);

    if (resetTypeSocial) {
      props.updateValue.type_id = +boxId;
    }

    if (urlValue) {
      props.updateValue.url = urlValue;
    }

    if (titleValue) {
      props.updateValue.name = titleValue;
    }

    console.log(boxId);
    setChecked(true);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const deleteHandler = () => {
    const connectDB = ConnectToDB("delete/social/box/ContactUsBoxes");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("social_id", socialId);

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
          }, 2800);

          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeSimpleSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
        setdataError(err.response.data.status);
      });

    setChecked(true);
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

  return (
    <Row className={classes.ContactSocial}>
      <MdOutlineDelete
        className={classes.deleteSocial}
        onClick={deleteHandler}
      />
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Type of Item</Form.Label>
        {!resetTypeSocial && (
          <Form.Control
            type="text"
            placeholder="Url"
            readOnly
            value={`${typeName} (${typeType})`}
          />
        )}
        {!resetTypeSocial && (
          <Badge
            className={classes.edit}
            onClick={resetTypeSocialHandler}
            bg="secondary"
          >
            edit
          </Badge>
        )}
        {resetTypeSocial && (
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            aria-label="Default select example"
          >
            <option>Select Item ...</option>
            {types.map((box) => (
              <option key={box.id} value={`${box.id}.${box.name}.${box.type}`}>
                {box.name} ({box.type})
              </option>
            ))}
          </Form.Select>
        )}
      </Form.Group>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        {(typeValue === "url" || typeType === "url") && (
          <Form.Label>Name Of {boxName}*</Form.Label>
        )}
        {(typeValue === "url" || typeType === "url") && (
          <Form.Control
            type="text"
            placeholder="Name"
            required
            value={resetName ? titleValue : name}
            onChange={titleChangeHandler}
            onBlur={titleBlurHandler}
          />
        )}
        {titleHasError && (typeValue === "url" || typeType === "url") && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
        {!resetName && (typeValue === "url" || typeType === "url") && (
          <Badge
            className={classes.edit}
            onClick={resetNameHandler}
            bg="secondary"
          >
            edit
          </Badge>
        )}
      </Form.Group>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Url Of {boxName}*</Form.Label>
        <Form.Control
          type="text"
          placeholder="Url"
          required
          value={resetUrl ? urlValue : url}
          onChange={urlChangeHandler}
          onBlur={urlBlurHandler}
        />
        {urlHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
        {!resetUrl && (
          <Badge
            className={classes.edit}
            onClick={resetUrlHandler}
            bg="secondary"
          >
            edit
          </Badge>
        )}
      </Form.Group>
      <BsFillSaveFill className={classes.saveSocials} onClick={submitHandler} />
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

export default UpdateContactItems;
