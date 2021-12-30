import classes from "./update.module.css";
import { Form, Row, Col, Badge, Alert, CloseButton } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../../ui/notification";
import axios from "axios";
import SocialUrlForm from "./SocialUrlForm";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;

const UpdateTeams = (props) => {
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [resetTitleValue, setResetTitleValue] = useState(false);
  const [resetTextValue, setResetTextValue] = useState(false);
  const [resetCharacterValue, setResetCharacterValue] = useState(false);
  const [resetImageValue, setResetImageValue] = useState(false);

  const [socialValues, setSocialValues] = useState([]);
  const [socialIds, setSocialIds] = useState([]);

  const data = props.updateData;

  const relId = data.socials.related_id;
  const typeId = props.sec.type_id;
  const teamId = data.id;

  const getSocial = (url) => {
    setSocialValues([...socialValues, url]);
  };

  const getSocialIds = (id) => {
    setSocialIds([...socialIds, id]);
  };

  let url = "update/section/teams/team";
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

  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    inputBlurHandler: textBlurHandler,
    reset: resetText,
  } = useInput(isText);

  const {
    value: characterValue,
    isValid: characterIsValid,
    hasError: characterHasError,
    valueChangeHandler: characterChangeHandler,
    inputBlurHandler: characterBlurHandler,
    reset: resetCharacter,
  } = useInput(isText);

  const resetTitleHandler = () => {
    setResetTitleValue(true);
  };

  const resetTextHandler = () => {
    setResetTextValue(true);
  };

  const resetCharacterHandler = () => {
    setResetCharacterValue(true);
  };

  const resetImageHandler = () => {
    setResetImageValue(true);
  };

  let updateIsValid = false;

  if (
    resetTitleValue ||
    resetTextValue ||
    resetImageValue ||
    resetCharacterValue ||
    socialValues.length > 0
  ) {
    updateIsValid = true;
  }

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  let socialUrls = [];

  for (let i = 0; i < data.socials.length; i++) {
    socialUrls[i] = (
      <SocialUrlForm
        getSocial={getSocial}
        getSocialIds={getSocialIds}
        socials={socialValues}
        key={i}
        slideNumber={i + 1}
        social={data.socials[i]}
      />
    );
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    setNotification("pending");

    const connectDB = ConnectToDB(url);

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    console.log(titleValue, textValue, selectedFile);

    fData.append("team_id", teamId);
    {
      titleValue && fData.append("name", titleValue);
    }
    {
      textValue && fData.append("post", textValue);
    }
    {
      characterValue && fData.append("charecter", characterValue);
    }

    if (socialValues.length > 0) {
      for (let i = 0; i < socialValues.length; i++) {
        fData.append(`social_url_${i + 1}`, socialValues[i]);
        fData.append(`social_url_id_${i + 1}`, socialIds[i]);
      }
    }

    console.log("llll", teamId);

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
          }, 2800);

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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="First Name"
              required
              value={resetTitleValue ? titleValue : data.name}
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
            <Form.Label>Post</Form.Label>
            <Form.Control
              placeholder="text"
              required
              value={resetTextValue ? textValue : data.post}
              onChange={textChangeHandler}
              onBlur={textBlurHandler}
            />

            {textHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Name.
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
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Character</Form.Label>
            <Form.Control
              placeholder="text"
              required
              value={resetCharacterValue ? characterValue : data.charecter}
              onChange={characterChangeHandler}
              onBlur={characterBlurHandler}
            />

            {textHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Character.
              </Alert>
            )}
            {!resetCharacterValue && (
              <Badge
                className={classes.edit}
                onClick={resetCharacterHandler}
                bg="secondary"
              >
                edit
              </Badge>
            )}
          </Form.Group>
        </Row>
        <Row className={`mb-3 ${classes.control}`}>{socialUrls}</Row>
        <Row className={classes.control}>
          {!resetImageValue && (
            <div className={classes.updateImage}>
              <Image
                width={200}
                height={200}
                alt="photo-member"
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

export default UpdateTeams;
