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

const isText = (value) => value.trim().length > 0;

const UpdateAccordion = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [textValue, setTextValue] = useState();

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTextValue, setResetTextValue] = useState(false);

  const data = props.updateData;

  const relId = data.title.related_id;
  const typeId = props.sec.type_id;
  const sectionId = props.sec.id;

  const url = "update/section/item/accordion";

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

  const itemsParse = JSON.parse(props.richTxt);

  let itemsRich;

  itemsRich = itemsParse.toString().replace(/[,]+/g, "");

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

  let updateIsValid = true;

  //   if (resetTitleValue || resetTextValue) {
  //     updateIsValid = true;
  //   }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    console.log(textValue);

    const fData = new FormData();

    console.log(titleValue, textValue);

    fData.append("section_id", sectionId);
    fData.append("related_id", relId);
    {
      titleValue && fData.append("title", titleValue);
    }
    {
      textValue && fData.append("text", textValue);
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
        console.log("Error", err);
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
      <h1>Update Module{relId}</h1>

      <Form onSubmit={submitHandler}>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={resetTitleValue ? titleValue : data.title.content}
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
                className={classes.editRich}
                onClick={resetTextHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
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

export default UpdateAccordion;
