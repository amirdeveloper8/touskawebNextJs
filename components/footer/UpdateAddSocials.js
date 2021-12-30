import { Fragment, useContext, useState } from "react";
import { Alert, Col, Form, Button } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./footer.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import Notification from "../ui/notification";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import { ConnectToDB } from "../../lib/connect-to-db";

const isText = (value) => value.trim().length > 0;

const UpdateAddSocials = (props) => {
  const [dataError, setdataError] = useState("something went wrong");
  const [notification, setNotification] = useState();

  const details = props.details;
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  //   const [selectedValue, setSelectedValue] = useState([]);

  const [resetUrl, setResetUrl] = useState(false);
  const [resetSoicalType, setResetSoicalType] = useState(false);

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
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

  let selectedValue = [];

  if (details) {
    const valId = details.type_id;
    const itm = props.socials.filter((item) => item.id === valId);
    selectedValue = itm[0].name;
  }
  console.log(selectedValue, "ssss");

  let boxId = 0;

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];

    const connectDB = ConnectToDB("add/social/footer");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("type_id", +boxId);
    fData.append("name", urlValue);
    fData.append("url", urlValue);
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
      onBlur={() => setChecked(false)}
      as={Col}
      lg={12}
      controlId="formGridFName"
      className={classes.createRow}
    >
      <Form.Select
        value={valueBox}
        onChange={changeHandler}
        aria-label="Default select example"
      >
        <option>Select Item ...</option>
        {props.socials
          .filter((item) => item.type !== "url")
          .map((box) => (
            <option key={box.id} value={`${box.id}.${box.name}.${box.type}`}>
              {box.name} ({box.type})
            </option>
          ))}
      </Form.Select>
      {checked && <MdOutlineFileDownloadDone className={classes.saveChecked} />}
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
      <Button className="w-100 mt-2" onClick={submitHandler} variant="success">
        Save
      </Button>
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

export default UpdateAddSocials;
