import { useContext, useState } from "react";
import { Col, Form, Alert } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import CreateLink1 from "./CreateLink1";

import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";

import Button from "../ui/Button";

import classes from "./footer.module.css";
import { getData } from "../../lib/get-data";
import CreateSocials from "./CreateSocials";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import Notification from "../ui/notification";

const isText = (value) => value.trim().length > 0;
const CreateFooter = () => {
  const [dataError, setdataError] = useState("something went wrong");
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [link1Count, setLink1Count] = useState(2);
  const [link1Urls, setLink1Urls] = useState([]);
  const [link2Count, setLink2Count] = useState(2);
  const [link2Urls, setLink2Urls] = useState([]);
  const [socialsCount, setSocialsCount] = useState(1);
  const [socialsValues, setSocialsValues] = useState([]);

  const [socials, setSocials] = useState([]);
  const [createSocials, setCreateSocials] = useState(false);

  let link1 = [];

  for (let i = 0; i < link1Count; i++) {
    link1[i] = <CreateLink1 linkUrls={link1Urls} number={i} key={i} />;
  }

  let link2 = [];

  for (let i = 0; i < link2Count; i++) {
    link2[i] = <CreateLink1 linkUrls={link2Urls} number={i} key={i} />;
  }

  let socialsSec = [];

  for (let i = 0; i < socialsCount; i++) {
    socialsSec[i] = (
      <CreateSocials
        socials={socials}
        value={socialsValues}
        key={i}
        number={i}
      />
    );
  }

  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput(isText);

  const {
    value: addressValue,
    isValid: addressIsValid,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddress,
  } = useInput(isText);

  const {
    value: addressUrlValue,
    isValid: addressUrlIsValid,
    hasError: addressUrlHasError,
    valueChangeHandler: addressUrlChangeHandler,
    inputBlurHandler: addressUrlBlurHandler,
    reset: resetAddressUrl,
  } = useInput(isText);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(isText);

  const {
    value: emailUrlValue,
    isValid: emailUrlIsValid,
    hasError: emailUrlHasError,
    valueChangeHandler: emailUrlChangeHandler,
    inputBlurHandler: emailUrlBlurHandler,
    reset: resetEmailUrl,
  } = useInput(isText);

  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: resetPhone,
  } = useInput(isText);

  const {
    value: phoneUrlValue,
    isValid: phoneUrlIsValid,
    hasError: phoneUrlHasError,
    valueChangeHandler: phoneUrlChangeHandler,
    inputBlurHandler: phoneUrlBlurHandler,
    reset: resetPhoneUrl,
  } = useInput(isText);

  const handleChange = (file) => {
    setSelectedFile(file[0]);
  };

  const decreaseLink1 = () => {
    if (link1Count > 1) {
      setLink1Count(link1Count - 1);
    }
  };

  const decreaseLink2 = () => {
    if (link2Count > 1) {
      setLink2Count(link2Count - 1);
    }
  };

  const decreaseSocialsCount = () => {
    if (socialsCount > 1) {
      setSocialsCount(socialsCount - 1);
    }
  };

  const createSocilasHandler = async (e) => {
    e.preventDefault();
    const socialDetails = await getData("get/contactform/typeSocial");
    setSocials(socialDetails.typeSocial);
    setCreateSocials(true);

    console.log(socials);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    let link1Value = [];
    for (let i = 0; i < link1Count; i++) {
      link1Value[i] = link1Urls[i];
    }

    let link2Value = [];
    for (let i = 0; i < link2Count; i++) {
      link2Value[i] = link2Urls[i];
    }

    const connectDB = ConnectToDB("create/footer");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();
    fData.append("description", descriptionValue);
    fData.append("image", selectedFile);
    fData.append("links1", JSON.stringify(link1Value));
    fData.append("links2", JSON.stringify(link2Value));

    fData.append(
      "social_adress",
      JSON.stringify({
        content: addressValue,
        url: addressUrlValue,
        type_id: 5,
      })
    );
    fData.append(
      "social_email",
      JSON.stringify({
        content: emailValue,
        url: `mailto:${emailUrlValue}`,
        type_id: 13,
      })
    );

    fData.append(
      "social_tel",
      JSON.stringify({
        content: phoneValue,
        url: `tel:${phoneUrlValue}`,
        type_id: 6,
      })
    );
    for (let i = 0; i < socialsCount; i++) {
      fData.append(`social_${i + 1}`, JSON.stringify(socialsValues[i]));
    }

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
    <Form onSubmit={submitHandler} className={classes.createFooter}>
      <div className={classes.createFooterBox} lg={3}>
        <h2>توضیحات</h2>
        <Form.Group lg={12} className="mb-3">
          <Form.Label>Logo*</Form.Label>
          <Form.Control
            name="image"
            id="image"
            type="file"
            onChange={(e) => handleChange(e.target.files)}
            size="sm"
          />
        </Form.Group>
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="description"
            value={descriptionValue}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          />

          {descriptionHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid description.
            </Alert>
          )}
        </Form.Group>
      </div>
      <div className={classes.createFooterBox} lg={3}>
        <h2>خدمات</h2>
        {link1}
        <div className={classes.countIcons}>
          <AiFillPlusSquare onClick={() => setLink1Count(link1Count + 1)} />
          <AiFillMinusSquare onClick={decreaseLink1} />
        </div>
      </div>
      <div className={classes.createFooterBox} lg={3}>
        <h2>لینک‌های مفید</h2>
        {link2}
        <div className={classes.countIcons}>
          <AiFillPlusSquare onClick={() => setLink2Count(link2Count + 1)} />
          <AiFillMinusSquare onClick={decreaseLink2} />
        </div>
      </div>
      <div className={classes.createFooterBox} lg={3}>
        <h2>آدرس شرکت</h2>
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>Address content</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            rows={5}
            placeholder="Address content"
            value={addressValue}
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
          />

          {addressHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid address.
            </Alert>
          )}

          <Form.Label>Address url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Address url"
            value={addressUrlValue}
            onChange={addressUrlChangeHandler}
            onBlur={addressUrlBlurHandler}
          />

          {addressUrlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid address url.
            </Alert>
          )}
        </Form.Group>

        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>email Content</Form.Label>
          <Form.Control
            type="text"
            placeholder="email"
            value={emailValue}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid email.
            </Alert>
          )}
          <Form.Label>email Url</Form.Label>
          <Form.Control
            type="email"
            placeholder="email"
            value={emailUrlValue}
            onChange={emailUrlChangeHandler}
            onBlur={emailUrlBlurHandler}
          />

          {emailUrlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid email.
            </Alert>
          )}
        </Form.Group>

        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>phone Content</Form.Label>
          <Form.Control
            type="text"
            dir="ltr"
            placeholder="phone"
            value={phoneValue}
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
          />

          {phoneHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid phone.
            </Alert>
          )}
          <Form.Label>phone Url</Form.Label>
          <Form.Control
            type="number"
            dir="ltr"
            className="text-left"
            placeholder="phone"
            value={phoneUrlValue}
            onChange={phoneUrlChangeHandler}
            onBlur={phoneUrlBlurHandler}
          />

          {phoneUrlHasError && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid phone.
            </Alert>
          )}
        </Form.Group>
        {!createSocials && (
          <Button
            className={classes.btnCreateSocials}
            onClick={createSocilasHandler}
          >
            Create Socials
          </Button>
        )}
        {createSocials && socialsSec}
        {createSocials && (
          <div className={classes.countIcons}>
            <AiFillPlusSquare
              onClick={() => setSocialsCount(socialsCount + 1)}
            />
            <AiFillMinusSquare onClick={decreaseSocialsCount} />
          </div>
        )}
      </div>
      <div className={classes.actions}>
        <Button>submit</Button>
      </div>
      {notification && (
        <Notification
          status={notifDetails.status}
          title={notifDetails.title}
          message={notifDetails.message}
        />
      )}
    </Form>
  );
};

export default CreateFooter;
