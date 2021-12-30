import { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import useInput from "../../hooks/use-input";
import classes from "./plans.module.css";

import axios from "axios";
import { ConnectToDB } from "../../lib/connect-to-db";
import Notification from "../ui/notification";
import AuthContext from "../../store/auth-context";
import UpdatePlansForm from "./UpdatePlansForm";

const UpdatePlans = (props) => {
  const value = props.value;
  const [count, setCount] = useState(value.length);

  let cats = [];

  for (let i = 0; i < count; i++) {
    cats[i] = <UpdatePlansForm key={i} value={value[i]} number={i} />;
  }

  return (
    <section className={classes.plans}>
      <Form>{cats} </Form>
    </section>
  );
};

export default UpdatePlans;
