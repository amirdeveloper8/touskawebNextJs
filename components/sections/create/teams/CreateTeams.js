import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Form, Row, Alert } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import classes from "../create.module.css";
import Notification from "../../../ui/notification";
import TeamsForm from "./TeamsForm";

const isText = (value) => value.trim().length > 0;
const CreateTeams = (props) => {
  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [slideCount, setSlideCount] = useState(1);
  const [names, setNames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [instagrams, setInstagrams] = useState([]);
  const [twitters, setTwitters] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [images, setImages] = useState([]);
  let sliders = [];

  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const getNames = (name) => {
    setNames([...names, name]);
  };

  const getPosts = (post) => {
    setPosts([...posts, post]);
  };

  const getImages = (image) => {
    setImages([...images, image]);
  };

  const getInstagrams = (instagram) => {
    setInstagrams([...instagrams, instagram]);
  };

  const getTwitters = (twitter) => {
    setTwitters([...twitters, twitter]);
  };

  const getCharacters = (character) => {
    setCharacters([...characters, character]);
  };

  const slideNumberHandleChange = (e) => {
    setSlideCount(e.target.value);
  };
  for (var i = 0; i < slideCount; i++) {
    sliders[i] = (
      <TeamsForm
        getNames={getNames}
        getPosts={getPosts}
        getImages={getImages}
        getInstagrams={getInstagrams}
        getTwitters={getTwitters}
        getCharacters={getCharacters}
        names={names}
        posts={posts}
        images={images}
        instagrams={instagrams}
        twitters={twitters}
        characters={characters}
        slideCount={slideCount}
        slideNumber={i + 1}
        key={i}
      />
    );
  }

  let socials = [];

  for (var i = 0; i < slideCount; i++) {
    socials[i] = [twitters[i], instagrams[i]];
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    fData.append("page_id", props.pageId);
    fData.append("type_id", 6);
    fData.append("image", selectedFile);
    fData.append("title", titleValue);
    fData.append("count", slideCount);
    for (var i = 0; i < slideCount; i++) {
      fData.append(`name_team_${i + 1}`, names[i]);
      fData.append(`post_team_${i + 1}`, posts[i]);
      fData.append(`social_url_team_${i + 1}`, JSON.stringify(socials[i]));
      fData.append(`charecter_team_${i + 1}`, characters[i]);
      fData.append(`image_team_${i + 1}`, images[i]);
    }

    const connectDB = ConnectToDB("create/section/teams");

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
        if (res.data.status === "success created") {
          setNotification(res.data.status);
          setTimeout(() => {
            authCtx.closePageHandler();
            props.getData();
          }, 2000);
          setTimeout(() => {
            authCtx.showPageHandler();
            authCtx.closeTeamsSection();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
      });
  };

  let formIsValid = false;

  if (
    titleIsValid &&
    (names.length && images.length && posts.length) === +slideCount
  ) {
    formIsValid = true;
  }

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
    <div className={classes.sliders}>
      <Form onSubmit={submitHandler}>
        <Row className={classes.controlFirstForm}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>تعداد افراد</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={4}
              placeholder="slide Number"
              required
              value={slideCount}
              onChange={slideNumberHandleChange}
            />
          </Form.Group>
          <Form.Group
            as={Col}
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
        </Row>

        <div className={`${classes.actions} ${classes.submitactions}`}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
      <div className={classes.slidesForm}>{sliders}</div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </div>
  );
};

export default CreateTeams;
