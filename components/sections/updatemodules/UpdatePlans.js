import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";
import UpdateListsPlans from "./UpdateListsPlan";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdatePlans = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTextValue, setResetTextValue] = useState(false);
  const [resetBtnTextValue, setResetBtnTextValue] = useState(false);
  const [resetBtnUrlValue, setResetBtnUrlValue] = useState(false);
  const [resetlists, setResetLists] = useState(false);
  const [resetImageValue, setResetImageValue] = useState(false);

  const data = props.updateData;

  const relId = data.title.related_id;
  const typeId = props.sec.type_id;
  const sectionId = props.sec.id;

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

  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const {
    value: btnTextValue,
    isValid: btnTextIsValid,
    hasError: btnTextHasError,
    valueChangeHandler: btnTextChangeHandler,
    inputBlurHandler: btnTextBlurHandler,
    reset: resetbtnText,
  } = useInput(isText);

  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
    reset: resetbtnUrl,
  } = useInput(isText);

  const [listsVal, setListsVal] = useState(JSON.parse(data.item.lists));

  const getLists = (list) => {
    setListsVal([...listsVal, list]);
  };

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetTextHandler = () => {
    setResetTextValue(true);
  };

  const resetBtnTextHandler = () => {
    setResetBtnTextValue(true);
  };

  const resetBtnUrlHandler = () => {
    setResetBtnUrlValue(true);
  };

  const resetImageHandler = () => {
    setResetImageValue(true);
  };

  const resetListsHandler = () => {
    setResetLists(true);
  };

  let updateIsValid = false;

  if (
    resetTitleValue ||
    resetTextValue ||
    resetImageValue ||
    resetBtnTextValue ||
    resetBtnUrlValue ||
    resetlists
  ) {
    updateIsValid = true;
  }

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log("button name", btnTextValue ? btnTextValue : data.button.name);
    console.log("button url", btnUrlValue ? btnUrlValue : data.button.url);

    setNotification("pending");
    const connectDB = ConnectToDB("update/section/box/plans");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, textValue, selectedFile, btnTextValue, btnUrlValue);

    {
      resetlists &&
        listsVal.map((list, idx) => fData.append(`list_${idx + 1}`, `${list}`));
    }

    {
      titleValue && fData.append("title", titleValue);
    }
    {
      textValue && fData.append("subtitle", textValue);
    }

    {
      btnTextValue
        ? fData.append("button_name", btnTextValue)
        : fData.append("button_name", data.button.name);
    }

    {
      btnUrlValue
        ? fData.append("button_url", btnUrlValue)
        : fData.append("button_url", data.button.url);
    }

    {
      selectedFile && fData.append("image", selectedFile);
    }

    fData.append("section_id", sectionId);
    fData.append("related_id", relId);
    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log(res);
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
        setNotification("error");
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

  let listItems = [];
  const lists = JSON.parse(data.item.lists);

  for (var i = 0; i < lists.length; i++) {
    listItems[i] = (
      <UpdateListsPlans
        key={i}
        getItems={getLists}
        slideNumber={i + 1}
        item={lists[i]}
        items={listsVal}
        resetList={resetListsHandler}
      />
    );
  }

  return (
    <section className={classes.auth}>
      <h1>Update Module Plans</h1>

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
              placeholder="Title"
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
            <Form.Label>Subtitle</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="text"
              required
              value={resetTextValue ? textValue : data.title.subtitle}
              onChange={textChangeHandler}
              onBlur={textBlurHandler}
            />

            {textHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Subtitle.
              </Alert>
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

        <Row className={`mb-3 ${classes.control}`}>{listItems}</Row>

        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>button name</Form.Label>
            <Form.Control
              placeholder="button name"
              required
              value={resetBtnTextValue ? btnTextValue : data.button.name}
              onChange={btnTextChangeHandler}
              onBlur={btnTextBlurHandler}
            />

            {btnTextHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetBtnTextValue && (
              <Badge
                className={classes.edit}
                onClick={resetBtnTextHandler}
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
            <Form.Label>button url</Form.Label>
            <Form.Control
              placeholder="button name"
              required
              value={resetBtnUrlValue ? btnUrlValue : data.button.url}
              onChange={btnUrlChangeHandler}
              onBlur={btnUrlBlurHandler}
            />

            {btnUrlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
              </Alert>
            )}
            {!resetBtnUrlValue && (
              <Badge
                className={classes.edit}
                onClick={resetBtnUrlHandler}
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
                width={600}
                height={747}
                src={data.image_url}
                alt="plan-update"
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

export default UpdatePlans;
