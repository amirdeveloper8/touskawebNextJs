import classes from "./plans-front.module.css";

import React from "react";
import Button from "../../ui/Button";
import jsPDF from "jspdf";
import Modal from "../../ui/Modal";
import { Table } from "react-bootstrap";
import { AiFillPrinter } from "react-icons/ai";
import { MdOutlineKeyboardReturn } from "react-icons/md";

const PrintValues = (props) => {
  const value = props.value;

  const generatePdf = () => {
    // const doc = new jsPDF("p", "pt", "a4");
    // doc.setLanguage("fa");
    // doc.addFont("FontsFree-Net-ir_sans.ttf", "iranFont", "normal");
    // doc.setFont("Arial");
    // doc.text("امیر محمد محمدی", 10, 10);
    // doc.save("test.pdf");
    // // doc.html(document.querySelector("#content"), {
    // //   callback: function (pdf) {
    // //     pdf.save("list.pdf");
    // //   },
    // // });
    window.print();
  };

  let basicSum = 0;
  for (let i = 0; i < value.basic.length; i++) {
    basicSum += +value.basic[i].price;
  }

  let offerSum = 0;
  for (let i = 0; i < value.offer.length; i++) {
    offerSum += +value.offer[i].price;
  }

  let specialSum = 0;
  for (let i = 0; i < value.special.length; i++) {
    specialSum += +value.special[i].price;
  }

  const allSum = (basicSum + offerSum + specialSum).toFixed(3);
  const finalSum = (
    basicSum +
    offerSum +
    specialSum +
    (basicSum + offerSum + specialSum) * 0.9
  ).toFixed(3);

  return (
    <div lang="fa" className={classes.print}>
      <h2 className="text-center mb-4">نتیجه نهایی</h2>
      <div className={classes.valuesItem}>
        <h3>امکانات پایه</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>قیمت</th>
            </tr>
          </thead>
          <tbody>
            {value.basic.map((item, index) => (
              <tr key={index}>
                <td>{item.name} </td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className={classes.valuesItem}>
        <h3>امکانات پیشنهادی</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>قیمت</th>
            </tr>
          </thead>
          <tbody>
            {value.offer.map((item, index) => (
              <tr key={index}>
                <td>{item.name} </td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className={classes.valuesItem}>
        <h3>امکانات تخصصی</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>قیمت</th>
            </tr>
          </thead>
          <tbody>
            {value.special.map((item, index) => (
              <tr key={index}>
                <td>{item.name} </td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className={classes.price}>
        <h5>
          <span>هزینه کلی: </span>
          {allSum}
        </h5>
        <h5 dir="rtl">
          <span>ارزش افزوده: </span>
          9%
        </h5>
        <h5>
          <span>هزینه کلی: </span>
          {finalSum}
        </h5>
      </div>
      <AiFillPrinter className={classes.printBtn} onClick={generatePdf} />
      <MdOutlineKeyboardReturn
        onClick={props.backStep1}
        className={classes.back}
      />
    </div>
  );
};

export default PrintValues;
