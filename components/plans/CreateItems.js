import { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import classes from "./plans.module.css";
import ItemsForm from "./ItemsForm";

import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import axios from "axios";
import { ConnectToDB } from "../../lib/connect-to-db";
import Notification from "../ui/notification";
import AuthContext from "../../store/auth-context";

const CreateItems = (props) => {
  const [dataError, setdataError] = useState("Something went wrong");
  const [notification, setNotification] = useState();
  const [count, setCount] = useState(4);
  const [catsValue, setCatsValue] = useState([]);

  let cats = [];

  for (let i = 0; i < count; i++) {
    cats[i] = (
      <ItemsForm cats={props.cats} key={i} number={i} catsValue={catsValue} />
    );
  }

  const decrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("items", JSON.stringify(catsValue));

    setNotification("pending");

    const connectDB = ConnectToDB("create/semiplan/item");

    const headers = {
      Authorization: `Bearer ${login_token}`,
    };

    const fData = new FormData();

    fData.append("items", JSON.stringify(catsValue));

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
        console.log("Error", err);
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
    <section className={classes.plans}>
      <div className={classes.countIcons}>
        <AiFillPlusCircle onClick={() => setCount(count + 1)} />
        <AiFillMinusCircle onClick={decrease} />
      </div>
      <Form>
        {cats}{" "}
        <div className={classes.actions}>
          <Button
            onClick={submitHandler}
            className={classes.submitCreateBtn}
            variant="success"
          >
            Submit
          </Button>
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

export default CreateItems;
