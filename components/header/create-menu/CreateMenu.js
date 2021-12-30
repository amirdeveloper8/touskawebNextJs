import { useContext, useState } from "react";
import useInput from "../../../hooks/use-input";
import CreateMenuItems from "./CreateMenuItems";

import { IoMdAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import classes from "./menu.module.css";
import { Form } from "react-bootstrap";

import Button from "../../ui/Button";
import AuthContext from "../../../store/auth-context";
import { ConnectToDB } from "../../../lib/connect-to-db";
import axios from "axios";
import Notification from "../../ui/notification";

const isText = (value) => value.trim().length > 0;

const CreateMenu = () => {
  const [dataError, setdataError] = useState("Something went Wrong!");
  const [notification, setNotification] = useState();
  const [itemCount, setItemCount] = useState(1);
  const [urlValues, setUrlValues] = useState([]);
  const [nameValues, setNameValues] = useState([]);
  const [subValues, setSubValues] = useState([]);

  const {
    value: titleValue,
    isValid: titleIsValid,
    hasError: titleHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    reset: resetTitle,
  } = useInput(isText);

  let items = [];
  for (let i = 0; i < itemCount; i++) {
    items[i] = (
      <CreateMenuItems
        urlValues={urlValues}
        nameValues={nameValues}
        subValues={subValues}
        key={i}
        number={i}
      />
    );
  }

  const increaseHandler = () => {
    setItemCount(itemCount + 1);
  };

  const decreaseHandler = () => {
    if (itemCount > 1) {
      setItemCount(itemCount - 1);
    }
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    const fData = new FormData();
    fData.append(`count`, +itemCount);
    for (let i = 0; i < itemCount; i++) {
      {
        urlValues[i].id && fData.append(`page_id_${i + 1}`, +urlValues[i].id);
      }
      {
        urlValues[i].id && console.log(`page_id_${i + 1}`, +urlValues[i].id);
      }
      {
        urlValues[i].url && fData.append(`url_${i + 1}`, urlValues[i].url);
      }
      fData.append(`name_${i + 1}`, nameValues[i]);
      {
        subValues[i] &&
          fData.append(`subs_${i + 1}`, JSON.stringify(subValues[i]));
      }
    }
    const connectDB = ConnectToDB("create/menus");

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
    <section className={classes.createMenu}>
      <div className={classes.menuHead}>
        <h2>Create Menu</h2>
        <div className={classes.icons}>
          <IoMdAddCircle onClick={increaseHandler} />
          <AiFillMinusCircle onClick={decreaseHandler} />
        </div>
      </div>
      <Form>
        {items}

        <div className={classes.btnSubmit}>
          <Button onClick={submitHandler}>submit</Button>
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

export default CreateMenu;
