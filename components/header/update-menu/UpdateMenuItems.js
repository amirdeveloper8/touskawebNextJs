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

import Modal from "../../ui/Modal";

const isText = (value) => value.trim().length > 0;

const UpdateMenuItems = (props) => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();

  const item = props.item;
  const subs = item.submenu;
  const itemId = item.id;

  const [checked, setChecked] = useState(false);

  const [valueBox, setValueBox] = useState("Open this select menu");
  const [menuItems, setMenuItems] = useState([]);
  const [usePageId, setUsePageId] = useState(false);
  const [typeValue, setTypeValue] = useState();

  const [resetItemValue, setResetItemValue] = useState(false);
  const [resetUrlValue, setResetUrlValue] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [viewSubs, setViewSubs] = useState(false);

  const [newSubCount, setNewSubCount] = useState(0);
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

  let subItems = [];
  let subItemsForSend = [];

  let updatedSubs = [];

  for (let i = 0; i < subs.length; i++) {
    if (subs[i].url) {
      subItemsForSend[i] = {
        id: subs[i].id,
        name: subs[i].name,
        page_id: "",
        url: subs[i].url,
      };
    }
    if (!subs[i].url) {
      subItemsForSend[i] = {
        id: subs[i].id,
        name: subs[i].name,
        page_id: subs[i].page_id,
        url: "",
      };
    }
    subItems[i] = (
      <UpdateSubs
        key={i}
        number={i}
        subs={subItemsForSend}
        item={subs[i]}
        id={subs[i].id}
      />
    );
  }

  let newSubs = [];

  for (let i = 0; i < newSubCount; i++) {
    newSubs[i] = <UpdateAddSub key={i} number={i} item={newSubsValue} />;
  }

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    for (let i = 0; i < subs.length; i++) {
      if (subItemsForSend[i].url !== "") {
        updatedSubs[i] = {
          id: subItemsForSend[i].id,
          name: subItemsForSend[i].name,
          url: subItemsForSend[i].url,
        };
      }
      if (subItemsForSend[i].url === "") {
        updatedSubs[i] = {
          id: subItemsForSend[i].id,
          name: subItemsForSend[i].name,
          page_id: subItemsForSend[i].page_id,
        };
      }
    }
    const allValues = updatedSubs.concat(newSubsValue);

    const fData = new FormData();

    console.log(allValues);

    fData.append("id", itemId);
    {
      itemValue && fData.append("name", itemValue);
    }

    {
      !itemValue && fData.append("name", item.name);
    }

    {
      urlValue && fData.append("url", urlValue);
    }

    {
      typeValue && fData.append("page_id", typeValue);
    }

    fData.append("subs", JSON.stringify(allValues));

    const connectDB = ConnectToDB("update/menus");

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
        if (res.data.status === "success updated") {
          console.log(res.data);
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 1500);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
        setdataError(err.response.data.status);
      });
  };

  const deleteHandler = () => {
    setNotification("pending");
    const fData = new FormData();

    fData.append("id", itemId);

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

  if (
    notification === "success updated" ||
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

  const url = !item.page_id ? item.url : item.page.url;
  return (
    <Row className={classes.control}>
      <div className={classes.delIcon}>
        <MdDelete onClick={() => setShowDelete(true)} />
      </div>
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
          value={resetItemValue ? itemValue : item.name}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && resetItemValue && (
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

          {urlHasError && resetUrlValue && (
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
      {subItems.length > 0 && (
        <div className="bg-dark p-3 mt-3">
          {!viewSubs && (
            <Button
              onClick={() => setViewSubs(true)}
              className={`w-100 ${classes.btnSubs}`}
              variant="info"
            >
              {" "}
              View Subs{" "}
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

          {viewSubs && subItems}
          {viewSubs && newSubs}
          {viewSubs && (
            <div className={classes.addNewSubsIcons}>
              <AiFillPlusSquare
                onClick={() => setNewSubCount(newSubCount + 1)}
              />
              {newSubCount > 0 && (
                <AiFillMinusSquare
                  onClick={() => setNewSubCount(newSubCount - 1)}
                />
              )}
            </div>
          )}
        </div>
      )}
      {subItems.length === 0 && (
        <div className="bg-secondary p-3 mt-3">
          {!viewSubs && (
            <Button
              onClick={() => setNewSubCount(newSubCount + 1)}
              className={`w-100 ${classes.btnSubs}`}
              variant="info"
            >
              {" "}
              Create Subs{" "}
            </Button>
          )}
          {viewSubs && (
            <Button
              onClick={() => setViewSubs(false)}
              className={`w-100 ${classes.btnSubs}`}
              variant="danger"
            >
              {" "}
              Cancel{" "}
            </Button>
          )}
          {newSubs}
          {newSubCount > 0 && (
            <div className={classes.addNewSubsIcons}>
              <AiFillPlusSquare
                onClick={() => setNewSubCount(newSubCount + 1)}
              />

              <AiFillMinusSquare
                onClick={() => setNewSubCount(newSubCount - 1)}
              />
            </div>
          )}
        </div>
      )}
      <Button
        onClick={submitHandler}
        className={`${classes.submitItem} ${classes.saveItem}`}
        variant="success"
      >
        Submit
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

export default UpdateMenuItems;
