import { useContext, useState } from "react";
import { Alert, Col, Form, Row, Button } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./plans.module.css";

import { AiFillEdit } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import AuthContext from "../../store/auth-context";
import { ConnectToDB } from "../../lib/connect-to-db";
import axios from "axios";

const isText = (value) => value.trim().length > 0;
const UpdatePlansForm = (props) => {
  const [resetValue, setResetValue] = useState(false);
  const {
    value: catValue,
    isValid: catIsValid,
    hasError: catHasError,
    valueChangeHandler: catChangeHandler,
    inputBlurHandler: catBlurHandler,
    reset: resetCat,
  } = useInput(isText);

  const catId = props.value.id;

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();

    const valueSend = [{ name: catValue, id: catId }];

    console.log("cat", JSON.stringify(valueSend));

    const connectDB = ConnectToDB("update/semiplan/cat");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("cat", JSON.stringify(valueSend));

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
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 800);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  const deleteHandler = () => {
    const valueSend = [{ id: catId }];
    const connectDB = ConnectToDB("delete/semiplan/cat");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("cat", JSON.stringify(valueSend));

    axios({
      method: "POST",
      url: connectDB,
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.status === "Success Deleted") {
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 500);
          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <Row className={classes.control}>
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Category {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Category ${props.number + 1}`}
          value={resetValue ? catValue : props.value.name}
          onChange={catChangeHandler}
          onBlur={catBlurHandler}
        />

        {catHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Button Name.
          </Alert>
        )}
        {!resetValue && (
          <AiFillEdit
            className={classes.edit}
            onClick={() => setResetValue(true)}
          />
        )}
        {resetValue && (
          <div className={classes.actions}>
            <Button
              onClick={submitHandler}
              className={classes.submitCreate}
              variant="success"
            >
              Submit
            </Button>
          </div>
        )}
      </Form.Group>
      <MdDelete className={classes.delIcon} onClick={deleteHandler} />
    </Row>
  );
};

export default UpdatePlansForm;
