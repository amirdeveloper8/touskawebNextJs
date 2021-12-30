import { useContext, useState } from "react";
import { Col, Form, Alert } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import UpdateLink1 from "./UpdateLink1";

import { AiFillPlusSquare } from "react-icons/ai";
import { AiFillMinusSquare } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";

import Button from "../ui/Button";

import classes from "./footer.module.css";
import { getData } from "../../lib/get-data";
import UpdateSocials from "./UpdateSocials";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";
import AuthContext from "../../store/auth-context";
import Notification from "../ui/notification";
import UpdateAddSocials from "./UpdateAddSocials";
import Image from "next/image";

const isText = (value) => value.trim().length > 0;
const UpdateFooter = (props) => {
  const details = props.details.footer;
  const links1 = details.links1;
  const links2 = details.links2;

  const socialsVal = details.socials;

  const socialTel = details.socials[0];
  const socialAddress = details.socials[1];
  const socialEmail = details.socials[2];

  const socialIcons = socialsVal.filter(
    (item) => item.type_id !== 5 && item.type_id !== 6 && item.type_id !== 13
  );

  let socialsOld = [];

  for (let i = 0; i < socialIcons.length; i++) {
    socialsOld[i] = {
      content: socialIcons[i].name,
      url: socialIcons[i].url,
      type_id: socialIcons[i].type_id,
      id: socialIcons[i].id,
    };
  }
  const [dataError, setdataError] = useState("something went wrong");
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [link1Count, setLink1Count] = useState(links1.length);
  const [link1Urls, setLink1Urls] = useState(links1);
  const [link2Count, setLink2Count] = useState(links2.length);
  const [link2Urls, setLink2Urls] = useState(links2);
  const [socialsCount, setSocialsCount] = useState(socialsVal.length - 3);
  const [socialsValues, setSocialsValues] = useState(socialsOld);

  const [socials, setSocials] = useState([]);
  const [createSocials, setCreateSocials] = useState(false);

  const [resetImg, setResetImg] = useState(false);
  const [resetDesc, setResetDesc] = useState(false);

  const [resetAddressContent, setResetAddressContent] = useState(false);
  const [resetAddressUrl, setResetAddressUrl] = useState(false);
  const [resetPhoneContent, setResetPhoneContent] = useState(false);
  const [resetPhoneUrl, setResetPhoneUrl] = useState(false);
  const [resetEmailContent, setResetEmailContent] = useState(false);
  const [resetEmailUrl, setResetEmailUrl] = useState(false);

  const [addSocial, setAddSocial] = useState(false);

  let link1 = [];

  for (let i = 0; i < link1Count; i++) {
    link1[i] = (
      <UpdateLink1
        details={links1[i]}
        linkUrls={link1Urls}
        number={i}
        key={i}
      />
    );
  }

  let link2 = [];

  for (let i = 0; i < link2Count; i++) {
    link2[i] = (
      <UpdateLink1
        details={links2[i]}
        linkUrls={link2Urls}
        number={i}
        key={i}
      />
    );
  }

  console.log(socialIcons);

  let socialsSec = [];

  for (let i = 0; i < socialsCount; i++) {
    socialsSec[i] = (
      <UpdateSocials
        socials={socials}
        value={socialsValues}
        key={i}
        number={i}
        details={socialsVal[i + 3]}
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
  } = useInput(isText);

  const {
    value: addressUrlValue,
    isValid: addressUrlIsValid,
    hasError: addressUrlHasError,
    valueChangeHandler: addressUrlChangeHandler,
    inputBlurHandler: addressUrlBlurHandler,
  } = useInput(isText);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(isText);

  const {
    value: emailUrlValue,
    isValid: emailUrlIsValid,
    hasError: emailUrlHasError,
    valueChangeHandler: emailUrlChangeHandler,
    inputBlurHandler: emailUrlBlurHandler,
  } = useInput(isText);

  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
  } = useInput(isText);

  const {
    value: phoneUrlValue,
    isValid: phoneUrlIsValid,
    hasError: phoneUrlHasError,
    valueChangeHandler: phoneUrlChangeHandler,
    inputBlurHandler: phoneUrlBlurHandler,
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

  const createSocilasHandler = async (e) => {
    e.preventDefault();
    const socialDetails = await getData("get/contactform/typeSocial");
    setSocials(socialDetails.typeSocial);
    setCreateSocials(true);

    console.log(socials);
  };

  const AddSocilasHandler = async (e) => {
    e.preventDefault();
    const socialDetails = await getData("get/contactform/typeSocial");
    setSocials(socialDetails.typeSocial);
    setAddSocial(true);

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

    const connectDB = ConnectToDB("update/footer");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();
    fData.append(
      "description",
      resetDesc ? descriptionValue : details.description
    );

    {
      resetImg && fData.append("image", selectedFile);
    }
    fData.append("links1", JSON.stringify(link1Value));
    fData.append("links2", JSON.stringify(link2Value));
    fData.append(
      "social_tel",
      JSON.stringify({
        content: resetPhoneContent ? phoneValue : socialTel.name,
        url: resetPhoneUrl ? `tel:${phoneUrlValue}` : socialTel.url,
        type_id: 6,
      })
    );
    fData.append(
      "social_adress",
      JSON.stringify({
        content: resetAddressContent ? addressValue : socialAddress.name,
        url: resetAddressUrl ? addressUrlValue : socialAddress.url,
        type_id: 5,
      })
    );
    fData.append(
      "social_email",
      JSON.stringify({
        content: resetEmailContent ? emailValue : socialEmail.name,
        url: resetEmailUrl ? `mailto:${emailUrlValue}` : socialEmail.url,
        type_id: 13,
      })
    );

    for (let i = 0; i < socialsCount; i++) {
      fData.append(`social_id_${i + 1}`, socialsValues[i].id);
      fData.append(`social_type_id_${i + 1}`, socialsValues[i].type_id);
      fData.append(`social_content_${i + 1}`, socialsValues[i].url);
      fData.append(`social_url_${i + 1}`, socialsValues[i].url);
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
    <Form onSubmit={submitHandler} className={classes.createFooter}>
      <div className={classes.createFooterBox} lg={3}>
        <h2>توضیحات</h2>
        <Form.Group lg={12} className={classes.formGroup}>
          <Form.Label>Logo*</Form.Label>
          {resetImg && (
            <Form.Control
              name="image"
              id="image"
              type="file"
              onChange={(e) => handleChange(e.target.files)}
              size="sm"
            />
          )}
          {!resetImg && details.logo_url && (
            <Image
              width={300}
              height={230}
              src={details.logo_url}
              alt="logo"
              className="w-100 bg-light"
            />
          )}
          {!resetImg && (
            <AiFillEdit
              className={classes.edit}
              onClick={() => setResetImg(true)}
            />
          )}
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
            value={resetDesc ? descriptionValue : details.description}
            onChange={descriptionChangeHandler}
            onBlur={descriptionBlurHandler}
          />
          {!resetDesc && (
            <AiFillEdit
              className={classes.edit}
              onClick={() => setResetDesc(true)}
            />
          )}

          {descriptionHasError && resetDesc && (
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
            value={resetAddressContent ? addressValue : socialAddress.name}
            onChange={addressChangeHandler}
            onBlur={addressBlurHandler}
          />
          {!resetAddressContent && (
            <AiFillEdit
              onClick={() => setResetAddressContent(true)}
              className={`${classes.editCont} ${classes.edit}`}
            />
          )}

          {addressHasError && resetAddressContent && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid address.
            </Alert>
          )}

          <Form.Label>Address url</Form.Label>
          <Form.Control
            type="text"
            placeholder="Address url"
            value={resetAddressUrl ? addressUrlValue : socialAddress.url}
            onChange={addressUrlChangeHandler}
            onBlur={addressUrlBlurHandler}
          />
          {!resetAddressUrl && (
            <AiFillEdit
              onClick={() => setResetAddressUrl(true)}
              className={classes.edit}
            />
          )}

          {addressUrlHasError && resetAddressUrl && (
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
            value={resetEmailContent ? emailValue : socialEmail.name}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
          />
          {emailHasError && resetEmailContent && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid email.
            </Alert>
          )}
          {!resetEmailContent && (
            <AiFillEdit
              onClick={() => setResetEmailContent(true)}
              className={`${classes.editCont} ${classes.edit}`}
            />
          )}
          <Form.Label>email Url</Form.Label>
          <Form.Control
            type="text"
            placeholder="email"
            value={resetEmailUrl ? emailUrlValue : socialEmail.url}
            onChange={emailUrlChangeHandler}
            onBlur={emailUrlBlurHandler}
          />

          {emailUrlHasError && resetEmailUrl && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid email.
            </Alert>
          )}
          {!resetEmailUrl && (
            <AiFillEdit
              onClick={() => setResetEmailUrl(true)}
              className={classes.edit}
            />
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
            placeholder="phone Content"
            value={resetPhoneContent ? phoneValue : socialTel.name}
            onChange={phoneChangeHandler}
            onBlur={phoneBlurHandler}
          />
          {!resetPhoneContent && (
            <AiFillEdit
              onClick={() => setResetPhoneContent(true)}
              className={`${classes.editCont} ${classes.edit}`}
            />
          )}

          {phoneHasError && resetPhoneContent && (
            <Alert className="mt-1" variant="danger">
              Please enter a valid phone.
            </Alert>
          )}
          <Form.Label>phone Url</Form.Label>
          <Form.Control
            type="number"
            dir="ltr"
            className="text-left"
            placeholder="phone Url"
            value={
              resetPhoneUrl ? phoneUrlValue : socialTel.url.replace("tel:", "")
            }
            onChange={phoneUrlChangeHandler}
            onBlur={phoneUrlBlurHandler}
          />

          {!resetPhoneUrl && (
            <AiFillEdit
              onClick={() => setResetPhoneUrl(true)}
              className={classes.edit}
            />
          )}

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
            Update Socials
          </Button>
        )}
        {createSocials && (
          <Button
            className={classes.btnCloseSocials}
            onClick={() => setCreateSocials(false)}
          >
            Close Socials
          </Button>
        )}
        {createSocials && socialsSec}
        <div className="mt-2">
          {!addSocial && (
            <Button
              className={classes.btnCreateSocials}
              onClick={AddSocilasHandler}
            >
              Add Social
            </Button>
          )}
          {addSocial && (
            <Button
              className={classes.btnCloseSocials}
              onClick={() => setAddSocial(false)}
            >
              Cancel
            </Button>
          )}
          {addSocial && <UpdateAddSocials socials={socials} />}
        </div>
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

export default UpdateFooter;
