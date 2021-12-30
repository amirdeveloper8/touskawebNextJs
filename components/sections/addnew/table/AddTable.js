import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import useInput from "../../../../hooks/use-input";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import AuthContext from "../../../../store/auth-context";
import Notification from "../../../ui/notification";
import classes from "./addtable.module.css";
import AddTr from "./AddTr";

const isText = (value) => value.trim().length > 0;
const AddTable = (props) => {
  const [getRow, setGetRow] = useState([]);
  const [countRow, setCountRow] = useState(4);

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const numberCol = props.numberOfColumns;
  const tableId = props.tableId;

  const authCtx = useContext(AuthContext);
  const login_token = authCtx.token;

  useEffect(() => {
    if (notification === "success created" || notification === "error") {
      const timer = setTimeout(() => {
        setNotification(null);
        setdataError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getRowHandler = (row) => {
    setGetRow([...getRow, row]);
  };

  let tr = [];
  for (let i = 0; i < countRow; i++) {
    tr[i] = (
      <AddTr
        key={i}
        getRow={getRow}
        getRowHandler={getRowHandler}
        columnsCount={numberCol}
        numberColumn={i + 1}
      />
    );
  }
  console.log("Col", numberCol);
  const {
    value: tabValue,
    isValid: tabIsValid,
    hasError: tabHasError,
    valueChangeHandler: tabChangeHandler,
    reset: resettab,
  } = useInput(isText);

  const submitRowHandler = (e) => {
    e.preventDefault();
    console.log("getRow", getRow, getRow.length);

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("title", tabValue);
    fData.append("tr", JSON.stringify(getRow));

    const connectDB = ConnectToDB("create/tab");

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
        if (res.data.status === "success created") {
          console.log(res.data);
          setNotification(res.data.status);
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 800);

          setTimeout(() => {
            authCtx.showPageHandler();
          }, 2000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
        setNotification("error");
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
    <Form onSubmit={submitRowHandler} className={classes.addTable}>
      <Form.Label className="text-right">new tab</Form.Label>
      <Form.Control
        type="text"
        placeholder="new tab"
        className={classes.inputTab}
        required
        value={tabValue}
        onChange={tabChangeHandler}
        // onBlur={tabBlurHandler}
      />
      <Table striped bordered hover>
        <tbody>{tr}</tbody>
      </Table>

      <Button onClick={submitRowHandler} className={classes.saveTable}>
        Save table
      </Button>
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

export default AddTable;
