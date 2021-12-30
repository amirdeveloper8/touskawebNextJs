import classes from "../update.module.css";
import { Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import useInput from "../../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-context";

import UpdateOptionForm from "./UpdateOptionForm";

import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { getData } from "../../../../lib/get-data";
import Notification from "../../../ui/notification";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const UpdateContactForm = (props) => {
  const sectionId = props.sec.id;
  const { label, name, type_namee, placeholder, valid, id } = props.updateData;
  const optionsVal = JSON.parse(props.updateData.options);
  console.log(label, name, type_namee, placeholder);

  const [editType, setEditType] = useState(false);
  const [editLabel, setEditLabel] = useState(false);
  const [editName, setEditName] = useState(false);
  const [editplaceholder, setEditPlaceholder] = useState(false);
  const [editValid, setEditValid] = useState(false);
  const [editOption, setEditOption] = useState(false);

  const [inputs, setInputs] = useState();

  const [dataError, setdataError] = useState();
  const [notification, setNotification] = useState();

  const [hasGroup, setHasGroup] = useState(true);

  const [value, setValue] = useState("choose inputs");
  const [inputId, setInputId] = useState();

  const [optionCount, setOptionCount] = useState(0);
  const [options, setOptions] = useState(optionsVal);

  const [checkVal, setCheckVal] = useState(false);

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
    value: labelValue,
    isValid: labelIsValid,
    hasError: labelHasError,
    valueChangeHandler: labelChangeHandler,
    inputBlurHandler: labelBlurHandler,
    reset: resetLabel,
  } = useInput(isText);

  const {
    value: placeholderValue,
    isValid: placeholderIsValid,
    hasError: placeholderHasError,
    valueChangeHandler: placeholderChangeHandler,
    inputBlurHandler: placeholderBlurHandler,
    reset: resetPlaceholder,
  } = useInput(isText);

  const {
    value: validValue,
    isValid: validIsValid,
    hasError: validHasError,
    valueChangeHandler: validChangeHandler,
    inputBlurHandler: validBlurHandler,
    reset: resetValid,
  } = useInput(isText);

  const getOptions = (option) => {
    setOptions([...options, option]);
  };

  const optionUpdateHandler = (opt) => {
    setEditOption(opt);
    console.log(editOption);
  };

  let optionSec = [];

  for (let i = 0; i < optionCount; i++) {
    optionSec[i] = (
      <UpdateOptionForm
        optionUpdateHandler={optionUpdateHandler}
        getOptions={getOptions}
        options={options}
        number={i + 1 + optionsVal.length}
      />
    );
  }

  const selectChangeHandler = (e) => {
    const val = e.target.value;
    setValue(val);
  };

  const submitIdHandler = () => {
    const valId = value.split(".");
    setInputId(valId[0]);
    console.log(valId[0]);
    setHasGroup(true);
    if (
      !value.includes("radio") ||
      !value.includes("check") ||
      !value.includes("select")
    ) {
      setOptions([]);
    }
  };

  const checkHandler = (e) => {
    const val = e.target.checked;
    setCheckVal(val);
  };

  const editTypeHandler = async () => {
    const dataInput = await getData("get/typeTable/contactForm");
    setInputs(dataInput.page);
    setEditType(true);
  };

  let formIsValid = false;

  if (
    editType ||
    editLabel ||
    editName ||
    editplaceholder ||
    editValid ||
    editOption
  ) {
    formIsValid = true;
  }

  const submitHandler = (e) => {
    e.preventDefault();

    console.log("section_id", sectionId);
    console.log("id", id);

    {
      editType && console.log("typeid", +inputId);
    }
    {
      editLabel && console.log("label", labelValue);
    }
    {
      editName && console.log("name", titleValue);
    }
    {
      editplaceholder && console.log("placeholder", placeholderValue);
    }
    {
      editValid && console.log("valid", validValue);
    }
    {
      editOption && console.log("options", JSON.stringify(options));
    }

    setNotification("pending");

    const fData = new FormData();

    fData.append("section_id", sectionId);
    fData.append("id", id);

    {
      editType && fData.append("type_id", +inputId);
    }
    {
      editLabel && fData.append("label", labelValue);
    }
    {
      editName && fData.append("name", titleValue);
    }
    {
      editplaceholder && fData.append("placeholder", placeholderValue);
    }
    {
      editValid && fData.append("valid", validValue);
    }
    {
      editOption && fData.append("options", JSON.stringify(options));
    }

    const connectDB = ConnectToDB("update/contactForm");

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
        console.log("res", res);
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

    console.log(fData);
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
      <h2>Input {props.slideNumber}</h2>
      <Form onSubmit={submitHandler}>
        <Row className={`mb-3 ${classes.control}`}>
          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Select
              onChange={selectChangeHandler}
              value={editType ? value : type_namee}
              onClick={submitIdHandler}
            >
              <option>{!editType ? type_namee : "select input"}</option>
              {/* {inputs.length === 0 && <option>Select Your Input</option>} */}
              {inputs &&
                inputs.map((input) => (
                  <option key={input.id}>
                    {input.id}. {input.name}
                  </option>
                ))}
            </Form.Select>
            {!editType && (
              <Badge className={classes.edit} onClick={editTypeHandler}>
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              required
              value={editName ? titleValue : name}
              onChange={titleChangeHandler}
              onBlur={titleBlurHandler}
            />

            {titleHasError && editName && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
            {!editName && (
              <Badge className={classes.edit} onClick={() => setEditName(true)}>
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Label*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Label"
              required
              value={editLabel ? labelValue : label}
              onChange={labelChangeHandler}
              onBlur={labelBlurHandler}
            />

            {labelHasError && editLabel && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
            {!editLabel && (
              <Badge
                className={classes.edit}
                onClick={() => setEditLabel(true)}
              >
                edit
              </Badge>
            )}
          </Form.Group>

          <Form.Group
            as={Col}
            lg={12}
            controlId="formGridFName"
            className={classes.formGroup}
          >
            <Form.Label>Placeholder*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Placeholder"
              required
              value={editplaceholder ? placeholderValue : placeholder}
              onChange={placeholderChangeHandler}
              onBlur={placeholderBlurHandler}
            />

            {placeholderHasError && editplaceholder && (
              <Alert className="mt-1" variant="danger">
                Please enter a valid Title.
              </Alert>
            )}
            {!editplaceholder && (
              <Badge
                className={classes.edit}
                onClick={() => setEditPlaceholder(true)}
              >
                edit
              </Badge>
            )}
          </Form.Group>

          {options.length !== 0 &&
            optionsVal.map((opt, index) => (
              <UpdateOptionForm
                key={index}
                optionUpdateHandler={optionUpdateHandler}
                name={opt}
                options={options}
                number={index + 1}
              />
            ))}

          {(options.length !== 0 ||
            value.includes("radio") ||
            value.includes("check") ||
            value.includes("select")) &&
            hasGroup && (
              <div className={classes.optionInput}>
                {optionSec}
                <AiFillPlusCircle
                  className={classes.addOption}
                  onClick={() => setOptionCount(optionCount + 1)}
                />
                {optionCount > 0 && (
                  <AiFillMinusCircle
                    className={classes.delOption}
                    onClick={() => setOptionCount(optionCount - 1)}
                  />
                )}
              </div>
            )}

          {!valid && (
            <Form.Group
              className={classes.formCheck}
              controlId={`formBasicCheckbox${props.slideNumber}`}
            >
              <Form.Check
                onChange={checkHandler}
                value={checkVal}
                type="checkbox"
                label="Check me out"
              />
            </Form.Group>
          )}
          {checkVal && (
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Label>Validation*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Validation"
                required
                value={validValue}
                onChange={validChangeHandler}
                onBlur={validBlurHandler}
              />

              {validHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Title.
                </Alert>
              )}
            </Form.Group>
          )}

          {valid && (
            <Form.Group
              as={Col}
              lg={12}
              controlId="formGridFName"
              className={classes.formGroup}
            >
              <Form.Label>Validation*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Validation"
                required
                value={editValid ? validValue : valid}
                onChange={validChangeHandler}
                onBlur={validBlurHandler}
              />

              {editValid && validHasError && (
                <Alert className="mt-1" variant="danger">
                  Please enter a valid Title.
                </Alert>
              )}
              {!editValid && (
                <Badge
                  className={classes.edit}
                  onClick={() => setEditValid(true)}
                >
                  edit
                </Badge>
              )}
            </Form.Group>
          )}
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

export default UpdateContactForm;
