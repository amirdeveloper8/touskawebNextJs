import useInput from "../../../hooks/use-input";
import UpdateMenuItems from "./UpdateMenuItems";

import classes from "./update-menu.module.css";
import { Form, Button } from "react-bootstrap";
import AddNewMenu from "./AddNewMenu";
import { useState } from "react";
const isText = (value) => value.trim().length > 0;

const UpdateMenu = (props) => {
  const data = props.data;
  let items = [];

  const [addNew, setAddNew] = useState(false);

  for (let i = 0; i < data.length; i++) {
    items[i] = <UpdateMenuItems key={i} number={i} item={data[i]} />;
  }

  return (
    <section className={classes.updateMenu}>
      <h2 className="text-center bg-light w-75 m-auto"> Update Menu </h2>
      <Form>{items}</Form>
      {!addNew && (
        <Button className={classes.addNewItem} onClick={() => setAddNew(true)}>
          Add New Item
        </Button>
      )}
      {addNew && <AddNewMenu number={data.length + 1} />}
    </section>
  );
};

export default UpdateMenu;
