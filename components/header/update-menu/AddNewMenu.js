import useInput from "../../../hooks/use-input";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import { useContext, useState } from "react";

import classes from "./update-menu.module.css";

import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { getData } from "../../../lib/get-data";
import UpdateSubs from "./UpdateSubs";
import UpdateAddSub from "./UpdateAddSub";
import Notification from "../../ui/notification";
import axios from "axios";
import AuthContext from "../../../store/auth-context";
import { ConnectToDB } from "../../../lib/connect-to-db";

const isText = (value) => value.trim().length > 0;

const AddNewMenu = (props) => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();

  const [checked, setChecked] = useState(false);

  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(false);
  const [typeValue, setTypeValue] = useState();

  const [viewSubs, setViewSubs] = useState(false);

  const [newSubCount, setNewSubCount] = useState(1);
  const [newSubsValue, setNewSubsValue] = useState([]);

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

  let newSubs = [];
  let subsSend = [];

  for (let i = 0; i < newSubCount; i++) {
    newSubs[i] = <UpdateAddSub key={i} number={i} item={newSubsValue} />;
  }

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(newSubsValue);

    if (newSubsValue.length > 0) {
      for (let i = 0; i < newSubCount; i++) {
        subsSend[i] = newSubsValue[i];
      }
    }

    const fData = new FormData();

    fData.append("count", 1);
    fData.append("name_1", itemValue);

    {
      urlValue && fData.append("url_1", urlValue);
    }
    {
      typeValue && fData.append("page_id_1", typeValue);
    }

    {
      subsSend.length > 0 && fData.append("subs_1", JSON.stringify(subsSend));
    }

    const connectDB = ConnectToDB("create/menus");

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
        if (res.data.status === "success created") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 3000);
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

  if (
    notification === "success created" ||
    notification === "success deleted"
  ) {
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
    <Row className={classes.control}>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Name"
          required
          value={itemValue}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Name.
          </Alert>
        )}
      </Form.Group>
      {!usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>Url</Form.Label>
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
              Please enter a valid Url.
            </Alert>
          )}

          <Badge className={classes.badge} onClick={changeTypeUrl}>
            Select from Pages
          </Badge>
        </Form.Group>
      )}
      {usePageId && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
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

      <div className="bg-dark p-3 mt-3">
        {!viewSubs && (
          <Button
            onClick={() => setViewSubs(true)}
            className={`w-100 ${classes.btnSubs}`}
            variant="info"
          >
            {" "}
            Add Subs{" "}
          </Button>
        )}
        {viewSubs && (
          <Button
            onClick={() => setViewSubs(false)}
            className={`w-100 ${classes.btnSubs}`}
            variant="danger"
          >
            {" "}
            Close Subs{" "}
          </Button>
        )}

        {viewSubs && newSubs}
        {viewSubs && (
          <div className={classes.addNewSubsIcons}>
            <AiFillPlusSquare onClick={() => setNewSubCount(newSubCount + 1)} />
            {newSubCount > 0 && (
              <AiFillMinusSquare
                onClick={() => setNewSubCount(newSubCount - 1)}
              />
            )}
          </div>
        )}
      </div>

      <Button
        onClick={submitHandler}
        className={`${classes.submitItem} ${classes.saveItem}`}
        variant="success"
      >
        Submit
      </Button>
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

export default AddNewMenu;
