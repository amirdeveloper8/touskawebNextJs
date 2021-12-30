import { Table, Tab } from "react-bootstrap";

import { BsCheckSquareFill } from "react-icons/bs";
import { BsFillXSquareFill } from "react-icons/bs";

import classes from "./table.module.css";
import GetTr from "./GetTr";
import { BiEdit } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { RiCloseCircleFill } from "react-icons/ri";
import { useContext, useState } from "react";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import axios from "axios";
import AuthContext from "../../../../store/auth-context";

import { AiTwotoneDelete } from "react-icons/ai";

const GetTable = (props) => {
  const tableId = props.tableId;
  const data = props.data;
  const number = props.number;
  const trJson = data.tr;
  const trArray = JSON.parse(trJson);
  const trLength = trArray.length;
  const widthStyle = 100 / trLength;

  const [update, setUpdate] = useState(false);

  let trs = [];
  let trValues = [];

  for (let i = 0; i < trLength; i++) {
    trValues[i] = trArray[i];
    trs[i] = (
      <tr key={i}>
        <GetTr data={trValues[i]} count={i} allValue={trValues} />
      </tr>
    );
  }

  const updateHandler = () => {
    setUpdate(true);
    console.log(trValues);
  };

  const closeInputHandler = () => {
    setUpdate(false);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const submitHandler = (e) => {
    e.preventDefault();

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("tab_id", data.id);
    fData.append("tr", JSON.stringify(trValues));

    const connectDB = ConnectToDB("update/table");

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
        if (res.data.status === "success updated") {
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 800);

          setTimeout(() => {
            authCtx.showPageHandler();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
      });
    console.log("table_id", tableId);
    console.log("tab_id", data.id);
    console.log("tr", JSON.stringify(trValues));
  };

  const deleteTableHandler = () => {
    console.log("table_id", tableId);
    console.log("tab_id", data.id);

    const fData = new FormData();
    fData.append("table_id", tableId);
    fData.append("tab_id", data.id);

    const connectDB = ConnectToDB("delete/section/Tab");

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
        if (res.data.status === "success deleted") {
          console.log(res.data);
          setTimeout(() => {
            authCtx.closePageHandler();
          }, 800);

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
    <Tab.Pane className={classes.tables} eventKey={`table${number}`}>
      <Table striped bordered hover>
        {!update && (
          <tbody className={classes.tableValues}>
            {trArray.map((td, index) => (
              <tr key={index}>
                {td.map((tr, index) => (
                  <td style={{ width: `${widthStyle}%` }} key={index}>
                    {tr === "true" && (
                      <BsCheckSquareFill className={classes.trueIcon} />
                    )}
                    {tr === "false" && (
                      <BsFillXSquareFill className={classes.falseIcon} />
                    )}
                    {tr !== "false" && tr !== "true" && tr}
                  </td>
                ))}
              </tr>
            ))}
            {trValues.length !== 0 && (
              <tr className={classes.editTable}>
                <td className={classes.editHeader}>
                  <BiEdit onClick={updateHandler} />
                </td>
              </tr>
            )}
            <tr className={classes.deleteTable}>
              <td className={classes.editHeader}>
                <AiTwotoneDelete onClick={deleteTableHandler} />
              </td>
            </tr>
          </tbody>
        )}
        {update && (
          <tbody
            className={`${classes.tableValues} ${classes.editTableValues}`}
          >
            {trs}
            <tr className={classes.editHeader}>
              <BsCheck onClick={submitHandler} />
            </tr>
            <tr className={classes.closeTh}>
              <RiCloseCircleFill onClick={closeInputHandler} />
            </tr>
          </tbody>
        )}
      </Table>
    </Tab.Pane>
  );
};

export default GetTable;
