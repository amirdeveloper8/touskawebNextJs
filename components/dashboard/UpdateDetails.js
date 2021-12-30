import classes from "./login.module.css";
import {
  Form,
  Row,
  Col,
  Badge,
  Alert,
  CloseButton,
  Button,
} from "react-bootstrap";
import { ConnectToDB } from "../../lib/connect-to-db";
import useInput from "../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-context";
import { useRouter } from "next/router";
import Notification from "../ui/notification";
import Modal from "../ui/Modal";
import axios from "axios";

import { BiDownArrow } from "react-icons/bi";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import AddKeywords from "./AddKeywords";

const isText = (value) => value.trim().length > 0;

const UpdateDetails = (props) => {
  const { meta, title, keys, seoTitle, desc, url } = props;
  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [seoDetails, setSeoDetails] = useState(false);
  const [openKeywords, setOpenKeywords] = useState(false);
  const [keyCounts, setKeyCounts] = useState(1);
  const [keywordsValue, setKeywordsValue] = useState([]);

  const [openKeysEver, setOpenKeysEver] = useState(false);

  const [metaReset, setMetaReset] = useState(false);
  const [titleReset, setTitleReset] = useState(false);
  const [seoTitleReset, setSeoTitleReset] = useState(false);
  const [descReset, setDescReset] = useState(false);
  const [urlReset, setUrlReset] = useState(false);

  const authCtx = useContext(AuthContext);

  const router = useRouter();

  const login_token = authCtx.token;
  const showPage = authCtx.showPage;

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
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
    reset: resetUrl,
  } = useInput(isText);

  const {
    value: excerptValue,
    isValid: excerptIsValid,
    hasError: excerptHasError,
    valueChangeHandler: excerptChangeHandler,
    inputBlurHandler: excerptBlurHandler,
    reset: resetExcerpt,
  } = useInput(isText);

  const {
    value: seoTitleValue,
    isValid: seoTitleIsValid,
    hasError: seoTitleHasError,
    valueChangeHandler: seoTitleChangeHandler,
    inputBlurHandler: seoTitleBlurHandler,
    reset: resetSeoTitle,
  } = useInput(isText);

  const {
    value: seoDescValue,
    isValid: seoDescIsValid,
    hasError: seoDescHasError,
    valueChangeHandler: seoDescChangeHandler,
    inputBlurHandler: seoDescBlurHandler,
    reset: resetSeoDesc,
  } = useInput(isText);

  const updateKeysHandler = () => {
    if (keys && keys.length !== 0 && !openKeysEver) {
      const keyWords = JSON.parse(keys);
      setKeywordsValue(keyWords);
      setKeyCounts(keyWords.length);
    }
    setOpenKeywords(true);
    setOpenKeysEver(true);
  };

  let keySec = [];

  for (let i = 0; i < keyCounts; i++) {
    keySec[i] = <AddKeywords key={i} number={i} data={keywordsValue} />;
  }

  let formIsValid = false;

  if (
    urlIsValid ||
    titleIsValid ||
    excerptIsValid ||
    seoTitleIsValid ||
    seoDescIsValid ||
    openKeysEver
  ) {
    formIsValid = true;
  }

  const decreaseKeyCountsHandler = () => {
    if (keyCounts > 1) {
      setKeyCounts(keyCounts - 1);
    }
  };

  const submitKeysHandler = () => {
    setOpenKeywords(false);
    console.log(keywordsValue);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    // setNotification("pending");

    const connectDB = ConnectToDB("page/update");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();
    fData.append("id", props.pageId);

    {
      titleValue && fData.append("title", titleValue);
    }
    {
      urlValue && fData.append("url", urlValue);
    }
    {
      excerptValue && fData.append("excerpt", excerptValue);
    }
    {
      selectedFile && fData.append("image", selectedFile);
    }

    {
      seoTitleValue && fData.append("title_seo", seoTitleValue);
    }
    {
      seoDescValue && fData.append("meta_description_seo", seoDescValue);
    }
    let keyVal = [];
    for (let i = 0; i < keyCounts; i++) {
      keyVal[i] = keywordsValue[i];
    }
    {
      openKeysEver && fData.append("keywords_seo", JSON.stringify(keyVal));
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
          }, 1000);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
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
      <h1>Update</h1>

      <Form onSubmit={submitHandler}>
        <Row className={classes.control}>
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
              value={titleReset ? titleValue : title}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
            {!titleReset && (
              <AiFillEdit
                className={classes.edit}
                onClick={() => setTitleReset(true)}
              />
            )}
          </Form.Group>
        </Row>

        <Row className={classes.control}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Url*</Form.Label>
            <Form.Control
              type="text"
              placeholder="type url of page"
              required
              value={urlReset ? urlValue : url}
              onChange={urlChangeHandler}
              onBlur={urlBlurHandler}
            />

            {urlHasError && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Url.
              </Alert>
            )}
            {!urlReset && (
              <AiFillEdit
                className={classes.edit}
                onClick={() => setUrlReset(true)}
              />
            )}
          </Form.Group>
        </Row>
        <Row className={classes.control}>
          <Form.Group
            as={Col}
            controlId="formGridMobile"
            className={classes.formGroup}
          >
            <Form.Label>Excerpt*</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="excerpt"
              value={descReset ? excerptValue : desc}
              onChange={excerptChangeHandler}
              onBlur={excerptBlurHandler}
            />

            {!descReset && (
              <AiFillEdit
                className={classes.edit}
                onClick={() => setDescReset(true)}
              />
            )}
          </Form.Group>
        </Row>
        {!seoDetails && (
          <Row className={classes.seoClick}>
            <Col lg={2}>
              <BiDownArrow onClick={() => setSeoDetails(true)} />
            </Col>
            <Col lg={10}>
              <h4>اطلاعات سئو</h4>
            </Col>
          </Row>
        )}
        {seoDetails && (
          <Row className={classes.control}>
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridMobile"
              className={classes.formGroup}
            >
              <Form.Label>Seo Title*</Form.Label>
              <Form.Control
                placeholder="Seo Title"
                required
                value={seoTitleReset ? seoTitleValue : seoTitle}
                onChange={seoTitleChangeHandler}
                onBlur={seoTitleBlurHandler}
              />

              {seoTitleHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Seo Title.
                </Alert>
              )}
              {!seoTitleReset && (
                <AiFillEdit
                  className={classes.edit}
                  onClick={() => setSeoTitleReset(true)}
                />
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridMobile"
              className={classes.formGroup}
            >
              <Form.Label>Seo description*</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Seo description"
                required
                value={metaReset ? seoDescValue : meta}
                onChange={seoDescChangeHandler}
                onBlur={seoDescBlurHandler}
              />

              {seoDescHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Seo description.
                </Alert>
              )}
              {!metaReset && (
                <AiFillEdit
                  className={classes.edit}
                  onClick={() => setMetaReset(true)}
                />
              )}
            </Form.Group>
            <Col lg={11} className="bg-light mx-auto mt-3">
              <h5 className={classes.addKeywords} onClick={updateKeysHandler}>
                Add Seo Keywords
              </h5>
            </Col>
          </Row>
        )}
        <div className={classes.actions}>
          <button disabled={!formIsValid} variant="primary" type="submit">
            Submit
          </button>
        </div>
      </Form>

      {openKeywords && (
        <Modal className={classes.modal}>
          <Row className={classes.keyBtns}>
            <Col lg={6}>
              <AiFillPlusCircle onClick={() => setKeyCounts(keyCounts + 1)} />
            </Col>
            <Col lg={6}>
              <AiFillMinusCircle onClick={decreaseKeyCountsHandler} />
            </Col>
          </Row>
          <Row className={classes.keyInputs}>{keySec}</Row>

          <Row className={classes.keyInputs}>
            <Col lg={12}>
              <Button
                variant="success"
                className="mt-3 px-5"
                onClick={submitKeysHandler}
              >
                Save
              </Button>
            </Col>
          </Row>
          <CloseButton
            onClick={() => setOpenKeywords(false)}
            className={classes.close}
          />
        </Modal>
      )}

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

export default UpdateDetails;
