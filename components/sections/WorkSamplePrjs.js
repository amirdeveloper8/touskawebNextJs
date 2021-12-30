import classes from "./worksamples.module.css";
import Modal from "../ui/Modal";
import Link from "next/link";

import { CloseButton } from "react-bootstrap";
import Button from "../ui/Button";
import Image from "next/image";

const WorkSamplePrjs = (props) => {
  const data = props.data;

  const closeHandler = () => {
    props.showProjectHandler(null);
  };
  return (
    <Modal className={classes.modal}>
      <h2 className="text-center w-100">{data.title_project}</h2>
      <CloseButton className={classes.close} onClick={closeHandler} />
      <div className={classes.projects}>
        <div className={classes.prjDetails}>
          <p>
            {" "}
            <span>نام وبسایت: </span> {data.name_project}
          </p>
          <p>
            {" "}
            <span>نام دامنه: </span>{" "}
            <Link href={data.url_project}>{data.url_project}</Link>
          </p>
          <div className={classes.actions}>
            <Button className={classes.buttonPrj}>
              <Link href={data.url_project}>{data.buttons.name}</Link>
            </Button>
          </div>
        </div>
        <div className={classes.prjImg}>
          <Image
            alt={data.name_project}
            src={data.image_project_url}
            width={450}
            height={400}
          />
        </div>
      </div>
    </Modal>
  );
};

export default WorkSamplePrjs;
