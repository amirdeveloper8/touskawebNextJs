import { Fragment, useContext, useState } from "react";
import { Alert, Col, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../update.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import axios from "axios";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";

const isText = (value) => value.trim().length > 0;

const AddContactItems = (props) => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();
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
    reset: resetUrl,
  } = useInput(isText);

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);
    console.log(valueBox);
    setChecked(false);

    setBoxName(val[1]);
    setTypeValue(val[2]);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  let boxId = 0;

  const submitHandler = () => {
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];
    setBoxName(boxVal[1]);

    const connectDB = ConnectToDB("add/social/box/ContactUsBoxes");

    console.log("box_id", props.boxId);
    console.log("type_id", +boxId);
    console.log("url", urlValue);
    console.log("name", titleValue);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("box_id", props.boxId);
    fData.append("type_id", +boxId);
    fData.append("url", urlValue);
    fData.append("name", titleValue);

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success created") {
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

  if (notification === "success created") {
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
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridFName"
      className={classes.ContactSocial}
    >
      <Form.Label>Type Of Items</Form.Label>
      <Form.Select
        value={valueBox}
        onChange={changeHandler}
        aria-label="Default select example"
      >
        <option>Select Item ...</option>
        {props.socials.map((box) => (
          <option key={box.id} value={`${box.id}.${box.name}.${box.type}`}>
            {box.name} ({box.type})
          </option>
        ))}
      </Form.Select>
      {checked && <MdOutlineFileDownloadDone className={classes.saveChecked} />}

      {typeValue === "url" && <Form.Label>Name Of {boxName}*</Form.Label>}
      {typeValue === "url" && (
        <Form.Control
          type="text"
          placeholder="Name"
          required
          value={titleValue}
          onChange={titleChangeHandler}
          onBlur={titleBlurHandler}
        />
      )}

      {titleHasError && typeValue === "url" && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Name.
        </Alert>
      )}
      <Form.Label>Url Of {boxName}*</Form.Label>
      <Form.Control
        type="text"
        placeholder="Url"
        required
        value={urlValue}
        onChange={urlChangeHandler}
        onBlur={urlBlurHandler}
      />

      {urlHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Name.
        </Alert>
      )}

      <BsFillSaveFill className={classes.saveSocials} onClick={submitHandler} />
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </Form.Group>
  );
};

export default AddContactItems;
