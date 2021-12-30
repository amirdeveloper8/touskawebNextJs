import classes from "../update.module.css";
import {
  Form,
  Row,
  Col,
  Badge,
  Alert,
  Button,
  CloseButton,
} from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../../ui/notification";
import axios from "axios";

import { RiMapPinFill } from "react-icons/ri";
import { RiPhoneFill } from "react-icons/ri";
import { MdMail } from "react-icons/md";
import { getData } from "../../../../lib/get-data";
import UpdateContactItems from "./UpdateContactItems";
import AddContactItems from "./AddContactItems";

import { RiDeleteBin7Fill } from "react-icons/ri";
import { RiAddBoxFill } from "react-icons/ri";

const isText = (value) => value.trim().length > 0;

const UpdateContactBoxes = (props) => {
  const data = props.updateData;

  console.log(data);

  const sectionId = data.section_id;
  const boxId = data.id;
  const typeName = props.sec.type.name;
  const socials = data.social_urls;

  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();

  const [resetTypeBox, setResetTypeBox] = useState(false);
  const [resetTitleValue, setResetTitleValue] = useState(false);

  const [valueBox, setValueBox] = useState();

  const [boxes, setBoxes] = useState([]);

  const [socialValues, setSocialValues] = useState([]);
  const [socialUrls, setSocialUrls] = useState([]);
  const [socialNames, setSocialNames] = useState([]);

  const [oldSocials, setOldSocials] = useState([]);

  const [newSocialCount, setNewSocialCount] = useState(1);

  const [socialSelect, setSocialSelect] = useState([]);

  const [updateItems, setUpdateItems] = useState(false);
  const [addItems, setAddItems] = useState(false);

  const [checked, setChecked] = useState(false);

  const getSocials = (val) => {
    setSocialValues([...socialValues, val]);
  };

  const getUrls = (val) => {
    setSocialUrls([...socialUrls, val]);
  };

  const getNames = (val) => {
    setSocialNames([...socialNames, val]);
  };

  const increaseSocial = async () => {
    const socialDetails = await getData("get/contactform/typeSocial");
    setSocialSelect(socialDetails.typeSocial);
    setNewSocialCount(newSocialCount + 1);
  };

  const decreaseSocial = () => {
    setNewSocialCount(newSocialCount - 1);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success updated" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const resetTypeBoxHandler = async () => {
    setResetTypeBox(true);
    const boxDetails = await getData("get/contactform/typeBox");
    setBoxes(boxDetails.typeBox);
    console.log(boxes);
  };

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const onChangeBox = (e) => {
    const value = e.target.value;
    setValueBox(value);
    console.log(valueBox);
  };

  let updateIsValid = true;

  if (resetTitleValue || resetTypeBox || updateItems) {
    updateIsValid = true;
  }

  let oldValues = [];

  for (let i = 0; i < socials.length; i++) {
    oldValues[i] = {
      url_type: socials[i].id,
      type_id: socials[i].type.id,
      name: socials[i].name,
      url: socials[i].url,
    };
  }

  const updateItemsHandler = (e) => {
    e.preventDefault();
    setOldSocials(oldValues);
    setUpdateItems(true);
  };

  const addItemsHandler = async (e) => {
    e.preventDefault();
    setOldSocials(oldValues);

    const socialDetails = await getData("get/contactform/typeSocial");
    setSocialSelect(socialDetails.typeSocial);
    setAddItems(true);
  };

  let social = [];

  for (let i = 0; i < socials.length; i++) {
    social[i] = (
      <UpdateContactItems
        data={socials[i]}
        updateValue={oldSocials[i]}
        key={i}
        slideNumber={i + 1}
      />
    );
  }

  let newSocial = [];

  for (let i = 0; i < newSocialCount; i++) {
    newSocial[i] = (
      <AddContactItems
        boxId={boxId}
        socials={socialSelect}
        key={i}
        slideNumber={i + 1}
      />
    );
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    console.log("data", data);

    const connectDB = ConnectToDB("update/box/ContactUsBoxes");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    console.log("count", data.social_urls.length);

    const fData = new FormData();

    fData.append("section_id", sectionId);
    fData.append("box_id", boxId);
    fData.append("count", data.social_urls.length);

    if (titleValue) {
      fData.append("title", titleValue);
    }

    if (valueBox) {
      const valueSplit = valueBox.split(".");
      const valueType = valueSplit[0];
      fData.append("type_id", valueType);
    }

    if (oldSocials.length !== 0) {
      fData.append("oldSocials", oldSocials);
      for (let i = 0; i < oldSocials.length; i++) {
        fData.append(`url_id_${i + 1}`, oldSocials[i].url_type);
        fData.append(`url_type_id_${i + 1}`, oldSocials[i].type_id);
        fData.append(`url_name_${i + 1}`, oldSocials[i].name);
        fData.append(`url_url_${i + 1}`, oldSocials[i].url);
      }
    }

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
  };

  let notifDetails;

  if (notification === "pending") {
    notifDetails = {
      status: "pending",
      title: "Sending message...",
      message: "Your message is on its way!",
    };
  }

  if (notification === "success updated") {
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
    <section className={classes.auth}>
      <h1>Update Module {typeName}</h1>

      <Form>
        <Row className={`mb-3 ${classes.control}`}>
          {!resetTypeBox && (
            <div className={classes.typeBox}>
              {data.type_box === "tel" && <RiPhoneFill />}
              {data.type_box === "adress" && <RiMapPinFill />}
              {data.type_box === "socials" && <MdMail />}
              <Badge
                bg="secondary"
                className={classes.edit}
                onClick={resetTypeBoxHandler}
              >
                edit
              </Badge>
            </div>
          )}
          {resetTypeBox && (
            <Form.Group
              onBlur={() => setChecked(false)}
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Select
                onChange={onChangeBox}
                value={valueBox}
                aria-label="Default select example"
              >
                <option>Select type box</option>
                {boxes.map((box) => (
                  <option key={box.id} value={`${box.id}.${box.name}`}>
                    {box.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
        </Row>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title*</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={resetTitleValue ? titleValue : data.title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetTitleValue && (
              <Badge
                className={classes.edit}
                onClick={resetTitleHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        {!updateItems && (
          <div>
            <Button
              className="mb-1"
              variant="success"
              onClick={updateItemsHandler}
            >
              Update Items
            </Button>
          </div>
        )}

        {updateItems && (
          <Row className={classes.itemsRow}>
            <h3>Update Items</h3>
            <CloseButton
              className={classes.closeItems}
              onClick={() => setUpdateItems(false)}
            />
          </Row>
        )}

        {updateItems && social}

        {!addItems && (
          <div>
            <Button
              className="mt-1"
              variant="success"
              onClick={addItemsHandler}
            >
              Add Items
            </Button>
          </div>
        )}

        {addItems && (
          <div className={classes.itemsRow}>
            <h3 className="mx-3">Add Items</h3>
            <CloseButton
              className={classes.closeItems}
              onClick={() => setAddItems(false)}
            />
          </div>
        )}

        {addItems && <Row className="mb-3">{newSocial}</Row>}

        <div className={classes.actions}>
          <button
            onClick={submitHandler}
            disabled={!updateIsValid}
            variant="primary"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>

      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </section>
  );
};

export default UpdateContactBoxes;
