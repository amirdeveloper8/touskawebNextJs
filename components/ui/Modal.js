import classes from "./modal.module.css";

const Modal = (props) => {
  const classModal = props.className
    ? `${props.className} ${classes.modal}`
    : `${classes.modal}`;
  return <div className={classModal}>{props.children}</div>;
};

export default Modal;
