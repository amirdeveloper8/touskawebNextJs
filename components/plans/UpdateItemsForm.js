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
const UpdateItemsForm = (props) => {
  const [valueBox, setValueBox] = useState("Open this select menu");
  const [typeValue, setTypeValue] = useState();

  const [resetValue, setResetValue] = useState(false);
  const [resetPriceVal, setResetPriceVal] = useState(false);
  const [resetCatVal, setResetCatVal] = useState(false);

  const {
    value: itemValue,
    isValid: itemIsValid,
    hasError: itemHasError,
    valueChangeHandler: itemChangeHandler,
    inputBlurHandler: itemBlurHandler,
    reset: resetItem,
  } = useInput(isText);
  const {
    value: priceValue,
    isValid: priceIsValid,
    hasError: priceHasError,
    valueChangeHandler: priceChangeHandler,
    inputBlurHandler: priceBlurHandler,
    reset: resetPrice,
  } = useInput(isText);

  const catId = props.value.id;

  const changeHandler = (e) => {
    const value = e.target.value;
    const val = value.split(".");
    setValueBox(value);

    setTypeValue(+val[0]);
    console.log("value", typeValue);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();

    const valueSend = [
      {
        name: itemValue ? itemValue : props.value.name,
        id: catId,
        category_semi_id: typeValue ? typeValue : props.value.cat.id,
        price: priceValue ? priceValue : props.value.price,
      },
    ];

    console.log("items", JSON.stringify(valueSend));

    const connectDB = ConnectToDB("update/semiplan/item");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("items", JSON.stringify(valueSend));

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
    const connectDB = ConnectToDB("delete/semiplan/item");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("items", JSON.stringify(valueSend));

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
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };

  return (
    <Row className={classes.control}>
      {!resetCatVal && (
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
            value={props.value.cat ? props.value.cat.name : " "}
          />

          <AiFillEdit
            className={classes.edit}
            onClick={() => setResetCatVal(true)}
          />
        </Form.Group>
      )}
      {resetCatVal && (
        <Form.Group
          as={Col}
          lg={12}
          controlId="formGridFName"
          className={classes.formGroup}
        >
          <Form.Label>Select Category*</Form.Label>
          <Form.Select
            value={valueBox}
            onChange={changeHandler}
            aria-label="Default select example"
          >
            <option>انتخاب پلن ...</option>
            {props.cats.map((box) => (
              <option key={box.id} value={`${box.id}.${box.name}`}>
                {box.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}
      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Item {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Item ${props.number + 1}`}
          value={resetValue ? itemValue : props.value.name}
          onChange={itemChangeHandler}
          onBlur={itemBlurHandler}
        />

        {itemHasError && (
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
      </Form.Group>

      <Form.Group
        as={Col}
        lg={12}
        controlId="formGridFName"
        className={classes.formGroup}
      >
        <Form.Label>Price {props.number + 1}</Form.Label>
        <Form.Control
          type="text"
          placeholder={`Price ${props.number + 1}`}
          value={resetPriceVal ? priceValue : props.value.price}
          onChange={priceChangeHandler}
          onBlur={priceBlurHandler}
        />

        {priceHasError && (
          <Alert className="mt-1" variant="danger">
            Please enter a valid Button Name.
          </Alert>
        )}
        {!resetPriceVal && (
          <AiFillEdit
            className={classes.edit}
            onClick={() => setResetPriceVal(true)}
          />
        )}
      </Form.Group>
      {(resetValue || resetPriceVal || resetCatVal) && (
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
      <MdDelete className={classes.delIcon} onClick={deleteHandler} />
    </Row>
  );
};

export default UpdateItemsForm;
