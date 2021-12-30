import axios from "axios";
import { useContext, useState } from "react";
import { Alert, Badge, Col, Form, Row, Button } from "react-bootstrap";
import useInput from "../../../hooks/use-input";
import { ConnectToDB } from "../../../lib/connect-to-db";
import AuthContext from "../../../store/auth-context";
import Notification from "../../ui/notification";
import classes from "./update.module.css";

const isText = (value) => value.trim().length > 0;
const UpdateButtons = (props) => {
  const buttonDetails = props.data.button;
  const buttonId = props.data.button[0].id;
  const secId = props.data.id;
  const typeId = props.data.type.id;
  const [resetBtnNameValue, setResetBtnNameValue] = useState(
    !buttonDetails[0].name
  );
  const [resetBtnUrlValue, setResetBtnUrlValue] = useState(
    !buttonDetails[0].url
  );

  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();

  const {
    value: btnNameValue,
    isValid: btnNameIsValid,
    hasError: btnNameHasError,
    valueChangeHandler: btnNameChangeHandler,
    inputBlurHandler: btnNameBlurHandler,
    reset: resetBtnName,
  } = useInput(isText);

  const {
    value: btnUrlValue,
    isValid: btnUrlIsValid,
    hasError: btnUrlHasError,
    valueChangeHandler: btnUrlChangeHandler,
    inputBlurHandler: btnUrlBlurHandler,
    reset: resetBtnUrl,
  } = useInput(isText);

  const resetBtnNameHandler = () => {
    setResetBtnNameValue(true);
  };

  const resetBtnUrlHandler = () => {
    setResetBtnUrlValue(true);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  let url = "";

  if (typeId === 8) {
    url = "update/sections";
  }

  if (typeId === 1) {
    url = "create/section/simple";
  }

  if (typeId === 13) {
    url = "update/section/imageortext";
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    {
      typeId !== 8 && fData.append("section_id", secId);
    }
    {
      typeId === 8 && fData.append("id", secId);
    }
    {
      typeId !== 8 && fData.append("button_id", buttonId);
    }
    {
      btnNameValue && fData.append("button_name", btnNameValue);
    }
    {
      btnUrlValue && fData.append("button_url", btnUrlValue);
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

  let formisvalid = false;

  if (btnNameIsValid && btnUrlIsValid) {
    formisvalid = true;
  }

  return (
    <section className={`mt-2 ${classes.auth}`}>
      <Form onSubmit={submitHandler}>
        <div className={classes.updateBtns}>
          <h2>Update Buttons</h2>
          {buttonDetails.map((btn) => (
            <Row key={btn.id} className={`mb-3 ${classes.control}`}>
              <Form.Group
                as={Col}
                lg={12}
                controlId="formGridFName"
                className={classes.formGroup}
              >
                <Form.Label>Button Name*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Button Name"
                  required
                  value={resetBtnNameValue ? btnNameValue : btn.name}
                  onChange={btnNameChangeHandler}
                  onBlur={btnNameBlurHandler}
                />

                {btnNameHasError && (
                  <Alert className="mt-1" variant="danger">
                    Please enter a valid Name.
                  </Alert>
                )}
                {!resetBtnNameValue && (
                  <Badge
                    className={classes.edit}
                    onClick={resetBtnNameHandler}
                    bg="secondary"
                  >
                    edit
                  </Badge>
                )}
              </Form.Group>

              <Form.Group
                as={Col}
                controlId="formGridFName"
                className={classes.formGroup}
              >
                <Form.Label>Button Url*</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Button Url"
                  required
                  value={resetBtnUrlValue ? btnUrlValue : btn.url}
                  onChange={btnUrlChangeHandler}
                  onBlur={btnUrlBlurHandler}
                />

                {btnUrlHasError && (
                  <Alert className="mt-1" variant="danger">
                    Please enter a valid Url.
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
          ))}
        </div>
        {(btnNameValue || btnUrlValue) && (
          <Button
            className={classes.btnUpdateBtn}
            disabled={!formisvalid}
            onClick={submitHandler}
            variant="success"
          >
            Submit
          </Button>
        )}
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

export default UpdateButtons;
