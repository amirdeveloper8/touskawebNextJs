import { Fragment, useContext, useState } from "react";
import { Alert, Col, Form } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./footer.module.css";
import { BsFillSaveFill } from "react-icons/bs";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import AuthContext from "../../store/auth-context";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";

const isText = (value) => value.trim().length > 0;

const UpdateSocials = (props) => {
  const details = props.details;
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [checked, setChecked] = useState(false);
  const [boxName, setBoxName] = useState();
  const [typeValue, setTypeValue] = useState();

  //   const [selectedValue, setSelectedValue] = useState([]);

  const [resetUrl, setResetUrl] = useState(false);
  const [resetSoicalType, setResetSoicalType] = useState(false);

  const {
    value: urlValue,
    isValid: urlIsValid,
    hasError: urlHasError,
    valueChangeHandler: urlChangeHandler,
    inputBlurHandler: urlBlurHandler,
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

  let selectedValue = [];

  if (details) {
    const valId = details.type_id;
    const itm = props.socials.filter((item) => item.id === valId);
    selectedValue = itm[0].name;
  }
  console.log(selectedValue, "ssss");

  let boxId = 0;

  const submitHandler = () => {
    const boxVal = valueBox.split(".");
    boxId = boxVal[0];

    const value = {
      content: resetUrl ? urlValue : details.url,
      url: resetUrl ? urlValue : details.url,
      type_id: resetSoicalType ? +boxId : details.type_id,
      id: details.id,
    };
    console.log(value);

    props.value[props.number] = value;
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const deleteHandler = () => {
    const connectDB = ConnectToDB("delete/social/footer");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("id", details.id);
    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "success deleted") {
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });
  };

  return (
    <Fragment>
      <Form.Group
        onBlur={() => setChecked(false)}
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={`mb-5 ${classes.createRow}`}
      >
        {!resetSoicalType && (
          <Form.Control
            type="text"
            placeholder="Url"
            required
            value={selectedValue}
            onChange={urlChangeHandler}
            onBlur={submitHandler}
          />
        )}
        {!resetSoicalType && (
          <AiFillEdit
            className={`${classes.editCont} ${classes.edit}`}
            onClick={() => setResetSoicalType(true)}
          />
        )}
        {resetSoicalType && (
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            aria-label="Default select example"
          >
            <option>Select Item ...</option>
            {props.socials
              .filter((item) => item.type !== "url")
              .map((box) => (
                <option
                  key={box.id}
                  value={`${box.id}.${box.name}.${box.type}`}
                >
                  {box.name} ({box.type})
                </option>
              ))}
          </Form.Select>
        )}
        {checked && (
          <MdOutlineFileDownloadDone className={classes.saveChecked} />
        )}
        <Form.Label>Url Of {boxName}*</Form.Label>
        <Form.Control
          type="text"
          placeholder="Url"
          required
          value={resetUrl ? urlValue : details.url}
          onChange={urlChangeHandler}
          onBlur={urlBlurHandler}
        />

        {urlHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Url.
          </Alert>
        )}
        {!resetUrl && (
          <AiFillEdit
            className={classes.edit}
            onClick={() => setResetUrl(true)}
          />
        )}
        <MdDelete className={classes.delIcon} onClick={deleteHandler} />
      </Form.Group>
    </Fragment>
  );
};

export default UpdateSocials;
