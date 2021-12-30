import { Fragment, useState } from "react";
import { Alert, Col, Form } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import classes from "../add.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";

const isText = (value) => value.trim().length > 0;

const AddContactUsForm = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();
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

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);
    console.log(valueBox);
    setChecked(false);

    setBoxName(val[1]);
    setTypeValue(val[2]);
  };

  let boxId = 0;

  const submitHandler = () => {
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];
    setBoxName(boxVal[1]);

    console.log(boxId);
    if (props.socialValues[+props.slideNumber - 1]) {
      props.socialValues[+props.slideNumber - 1] = +boxId;
    }
    if (!props.socialValues[+props.slideNumber - 1]) {
      props.getSocials(+boxId);
    }

    if (props.socialUrls[+props.slideNumber - 1]) {
      props.socialUrls[+props.slideNumber - 1] = urlValue;
    }
    if (!props.socialUrls[+props.slideNumber - 1]) {
      props.getUrls(urlValue);
    }

    if (props.socialNames[+props.slideNumber - 1]) {
      props.socialNames[+props.slideNumber - 1] = titleValue;
    }
    if (!props.socialNames[+props.slideNumber - 1]) {
      props.getNames(titleValue);
    }
    setChecked(true);
  };

  return (
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridFName"
      className={classes.ContactSocial}
    >
      <Form.Select
        value={valueBox}
        onChange={changeHandler}
        aria-label="Default select example"
      >
        <option>Select Item ...</option>
        {props.socials.map((box) => (
          <option key={box.id} value={`${box.id}.${box.name}.${box.type}`}>
            {box.name} ({box.type})
          </option>
        ))}
      </Form.Select>
      {checked && <MdOutlineFileDownloadDone className={classes.saveChecked} />}

      {typeValue === "url" && <Form.Label>Name Of {boxName}*</Form.Label>}
      {typeValue === "url" && (
        <Form.Control
          type="text"
          placeholder="Name"
          required
          value={titleValue}
          onChange={titleChangeHandler}
          onBlur={titleBlurHandler}
        />
      )}

      {titleHasError && typeValue === "url" && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Name.
        </Alert>
      )}
      <Form.Label>Url Of {boxName}*</Form.Label>
      <Form.Control
        type="text"
        placeholder="Url"
        required
        value={urlValue}
        onChange={urlChangeHandler}
        onBlur={urlBlurHandler}
      />

      {urlHasError && (
        <Alert className="mt-1" variant="danger">
          Please enter a valid Name.
        </Alert>
      )}

      <BsFillSaveFill className={classes.saveSocials} onClick={submitHandler} />
    </Form.Group>
  );
};

export default AddContactUsForm;
