import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";
import ListAccordion from "../getdata/ListAccordion";
import NewRich from "../../richtexteditor/NewRich";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdateBanner = (props) => {
  const data = props.updateData;

  const pageId = props.sec.page_id;
  const sectionId = props.sec.id;

  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [textValue, setTextValue] = useState();

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTextValue, setResetTextValue] = useState(!props.richTxt);
  const [resetImageValue, setResetImageValue] = useState(!data.image_url);

  console.log("typeId", pageId);

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  if (props.richTxt) {
    const itemsParse = JSON.parse(props.richTxt);

    let itemsRich;

    itemsRich = itemsParse.toString().replace(/[,]+/g, "");
  }

  const getTextValue = (value) => {
    setTextValue(value);
    console.log("textValue", textValue);
  };

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetTextHandler = () => {
    setResetTextValue(true);
  };

  const resetImageHandler = () => {
    setResetImageValue(true);
  };

  let updateIsValid = false;

  if (resetTitleValue || resetTextValue || resetImageValue) {
    updateIsValid = true;
  }

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB("update/section/banner");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, textValue, selectedFile);

    fData.append("section_id", sectionId);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      textValue && fData.append("subtitle", JSON.stringify(textValue));
    }
    {
      selectedFile && fData.append("image", selectedFile);
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
            props.getData();
          }, 2000);

          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeSimpleSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response);
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
      <h1>Update Module Simple</h1>

      <Form onSubmit={submitHandler}>
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

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>text*</Form.Label>
            {resetTextValue && (
              <NewRich getTexts={getTextValue} updateValue={itemsRich} />
            )}
            {!resetTextValue && (
              <div className={classes.editTxtRich}>
                <ListAccordion items={props.richTxt} />
              </div>
            )}
            {!resetTextValue && (
              <Badge
                className={classes.edit}
                onClick={resetTextHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row className={classes.control}>
          {!resetImageValue && (
            <div className={classes.updateImage}>
              <Image
                alt="banner-img"
                width={1024}
                height={800}
                src={data.image_url}
              />

              <Badge
                className={classes.edit}
                onClick={resetImageHandler}
                bg="secondary"
              >
                edit
              </Badge>
            </div>
          )}
          {resetImageValue && (
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                name="image"
                id="image"
                type="file"
                onChange={(e) => handleChange(e.target.files)}
                size="sm"
              />
            </Form.Group>
          )}
        </Row>
        <div className={classes.actions}>
          <button disabled={!updateIsValid} variant="primary" type="submit">
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

export default UpdateBanner;
