import { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import BaseInput from "../ui/inputs/BaseInput";
import FileInput from "../ui/inputs/FileInput";
import RadioInput from "../ui/inputs/RadioInput";
import SelectInput from "../ui/inputs/SelectInput";
import Button from "../ui/Button";
import classes from "./contactform.module.css";
import Image from "next/image";
import axios from "axios";
import Notification from "../ui/notification";
import { ConnectToDB } from "../../lib/connect-to-db";

const ContactFormSection = (props) => {
  const data = props.details.section_content;
  const imgSrc = props.details.photo_url;
  const title = props.details.title;

  const emailAction = props.details.eamilaction[0].emailaction;

  const [notification, setNotification] = useState();
  const [dataError, setdataError] = useState();

  const [successSent, setSuccessSent] = useState(false);

  let value = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].type_namee !== "submit") {
      value[i] = "";
    }
  }

  const getValue = (number, name) => {
    value[number] = name;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setNotification("pending");

    const fData = new FormData();

    for (let i = 0; i < data.length; i++) {
      if (data[i].type_namee !== "submit") {
        fData.append(`${data[i].name}`, value[i]);
      }
    }
    fData.append("emailaction", emailAction);

    const connectDB = ConnectToDB("send-mail");

    axios({
      method: "POST",
      url: connectDB,
      data: fData,
    })
      .then((res) => {
        if (res.data.status === "success sent") {
          setNotification(res.data.status);
          setTimeout(() => {
            setSuccessSent(true);
            setNotification();
          }, 3000);
        }
      })
      .catch((err) => {
        console.log("Error", err.response.data);
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

  if (notification === "success sent") {
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
    <section className={classes.contactForm}>
      <h2 className={classes.title}>{title}</h2>
      <div className={classes.details}>
        <div className={classes.imageC}>
          <Image alt={title} src={imgSrc} width={600} height={770} />
        </div>
        {!successSent && (
          <Form onSubmit={submitHandler}>
            {data.map((item, index) => (
              <Row key={index}>
                {(item.type_namee === "text" ||
                  item.type_namee === "number" ||
                  item.type_namee === "email" ||
                  item.type_namee === "textarea" ||
                  item.type_namee === "colorpicker" ||
                  item.type_namee === "password") && (
                  <BaseInput
                    data={item}
                    id={`${props.details.id}_${index}`}
                    number={index + 1}
                    getValue={getValue}
                    value={value}
                  />
                )}
                {item.type_namee === "file" && (
                  <FileInput
                    id={`${props.details.id}_${index}`}
                    name={item.name}
                    getValue={getValue}
                    number={index + 1}
                  />
                )}
                {(item.type_namee === "radioButton" ||
                  item.type_namee === "checkbox") && (
                  <RadioInput
                    id={`${props.details.id}_${index}`}
                    data={item}
                    getValue={getValue}
                    number={index + 1}
                  />
                )}
                {item.type_namee === "select" && (
                  <SelectInput
                    id={`${props.details.id}_${index}`}
                    data={item}
                    getValue={getValue}
                    number={index + 1}
                  />
                )}

                {item.type_namee === "submit" && (
                  <div className={classes.actions}>
                    <Button>{item.name}</Button>
                  </div>
                )}
              </Row>
            ))}
          </Form>
        )}
        {successSent && (
          <div className={classes.senMsg}>
            <h3 dir="rtl"> پیام شما با موفقیت ارسال شد ! </h3>
            <Button onClick={() => setSuccessSent(false)}>ارسال مجدد</Button>
          </div>
        )}
      </div>
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

export default ContactFormSection;
