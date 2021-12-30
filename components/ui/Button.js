import classes from "./button.module.css";

const Button = (props) => {
  const classButton = props.className
    ? `${props.className} customBtn ${classes.button}`
    : `${classes.button} customBtn`;
  return (
    <button
      disabled={props.disabled}
      className={classButton}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
