import classes from "./worksamples.module.css";

const WorkSampleBoxes = (props) => {
  const data = props.data;
  const number = props.number;

  const prjHandler = () => {
    props.showProjectHandler(number);
    console.log(props.getNumber);
  };

  return (
    <div
      style={{ backgroundImage: `url("${data.image_box_url}")` }}
      className={classes.box}
      onClick={prjHandler}
    >
      <h5>{data.title_box}</h5>
    </div>
  );
};

export default WorkSampleBoxes;
