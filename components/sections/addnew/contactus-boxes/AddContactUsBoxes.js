import classes from "../add.module.css";
import { Form, Row, Col, Alert } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import AddContactUsForm from "./AddContactUsForm";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { RiAddBoxFill } from "react-icons/ri";

import { MdOutlineFileDownloadDone } from "react-icons/md";
import { getData } from "../../../../lib/get-data";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const AddContactUsBoxes = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [valueBox, setValueBox] = useState();
  const [socialCount, setSocialCount] = useState(1);
  const [socialValues, setSocialValues] = useState([]);
  const [socialUrls, setSocialUrls] = useState([]);
  const [socialNames, setSocialNames] = useState([]);

  const [boxes, setBoxes] = useState([]);
  const [allSocials, setAllSocials] = useState([]);

  const [checked, setChecked] = useState(false);

  const onChangeBox = (e) => {
    const value = e.target.value;
    setValueBox(value);
    console.log(valueBox);
  };

  const getDataHandler = async () => {
    const boxDetails = await getData("get/contactform/typeBox");
    const socialDetails = await getData("get/contactform/typeSocial");
    setBoxes(boxDetails.typeBox);
    setAllSocials(socialDetails.typeSocial);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success created" || notification === "error") {
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

  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let formIsValid = true;

  if (titleIsValid && textIsValid) {
    formIsValid = true;
  }

  let socialDetails = [];

  for (let i = 0; i < socialCount; i++) {
    socialDetails[i] = "";
  }

  const getSocials = (val) => {
    setSocialValues([...socialValues, val]);
  };

  const getUrls = (val) => {
    setSocialUrls([...socialUrls, val]);
  };

  const getNames = (val) => {
    setSocialNames([...socialNames, val]);
  };

  let socials = [];

  for (let i = 0; i < socialCount; i++) {
    socials[i] = (
      <AddContactUsForm
        socialValues={socialValues}
        getSocials={getSocials}
        socialUrls={socialUrls}
        getUrls={getUrls}
        getNames={getNames}
        socialNames={socialNames}
        socials={allSocials}
        key={i}
        slideNumber={i + 1}
      />
    );
  }

  const increaseSocial = () => {
    setSocialCount(socialCount + 1);
  };

  const decreaseSocial = () => {
    setSocialCount(socialCount - 1);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const connectDB = ConnectToDB("create/box/ContactUsBoxes");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const BoxDetails = valueBox.split(".");
    const BoxId = BoxDetails[0];
    const fData = new FormData();

    fData.append("section_id", props.secId);
    fData.append("title", titleValue);
    fData.append("type_id", BoxId);

    let bodyBox = [];
    for (let i = 0; i < socialValues.length; i++) {
      bodyBox[i] = {
        type_id: socialValues[i],
        name: socialNames[i],
        url: socialUrls[i],
      };
    }
    fData.append("body", JSON.stringify(bodyBox));

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res);
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
    <section className={classes.auth}>
      <h2 className="m-0">Add New Box</h2>
      <Form onSubmit={submitHandler}>
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        <Row className={classes.control}>
          <Form.Group
            onBlur={() => setChecked(false)}
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Select
              onChange={onChangeBox}
              onClick={getDataHandler}
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

          <Form.Group
            onBlur={() => setChecked(false)}
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              required
              value={titleValue}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
          </Form.Group>
        </Row>

        <Row className={classes.control}>
          <h3 className="bg-light my-0 mx-auto w-75">Items</h3>
          {socials}
          <div className={classes.socialContactIcons}>
            <RiAddBoxFill
              onClick={increaseSocial}
              className={classes.addSocialContact}
            />
            {socialCount > 1 && (
              <RiDeleteBin7Fill
                onClick={decreaseSocial}
                className={classes.delSocialContact}
              />
            )}
          </div>
        </Row>

        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Save
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

export default AddContactUsBoxes;
