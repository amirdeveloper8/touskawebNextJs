import classes from "./update.module.css";
import { Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { ConnectToDB } from "../../../lib/connect-to-db";
import useInput from "../../../hooks/use-input";
import { useContext, useEffect, useState } from "react";

const isText = (value) => value.trim().length > 0;

const SocialUrlForm = (props) => {
  const {
    value: textValue,
    isValid: textIsValid,
    hasError: textHasError,
    valueChangeHandler: textChangeHandler,
    reset: resetText,
  } = useInput(isText);
  const [resetTextValue, setResetTextValue] = useState(false);

  const resetTextHandler = () => {
    setResetTextValue(true);
    // props.resetList();
    console.log(props.item);
  };

  const textBlurHandler = () => {
    if (!props.socials[+props.slideNumber - 1]) {
      props.getSocial(textValue);
      props.getSocialIds(props.social.id);
    } else {
      props.socials[+props.slideNumber - 1] = textValue;
    }
  };

  return (
    <Form.Group
      as={Col}
      lg={12}
      controlId="formGridMobile"
      className={classes.formGroup}
    >
      <Form.Label>Social Media {props.slideNumber}</Form.Label>
      <Form.Control
        placeholder={`Social Media ${props.slideNumber}`}
        value={resetTextValue ? textValue : props.social.url}
        onChange={textChangeHandler}
        onBlur={textBlurHandler}
      />

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
  );
};

export default SocialUrlForm;
