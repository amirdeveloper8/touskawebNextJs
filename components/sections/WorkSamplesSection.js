import { useState } from "react";
import WorkSampleBoxes from "./WorkSampleBoxes";
import WorkSamplePrjs from "./WorkSamplePrjs";
import classes from "./worksamples.module.css";

const WorkSamplesSection = (props) => {
  const data = props.details.section_content;
  const secLength = data.length;
  const title = props.details.title;

  const [getNumber, setGetNumber] = useState();

  let boxes = [];
  let projects = [];
  let showPrj;

  const showProjectHandler = (number) => {
    setGetNumber(number);
  };
  for (let i = 0; i < secLength; i++) {
    boxes[i] = (
      <WorkSampleBoxes
        data={data[i]}
        key={i}
        number={i}
        showProjectHandler={showProjectHandler}
        getNumber={getNumber}
      />
    );
    projects[i] = (
      <WorkSamplePrjs
        data={data[i]}
        key={i}
        showProjectHandler={showProjectHandler}
      />
    );

    showPrj = projects[getNumber];
  }

  return (
    <section className={classes.worksamples}>
      <h1>{title}</h1>
      <div className={classes.details}>{boxes}</div>
      {showPrj}
    </section>
  );
};

export default WorkSamplesSection;
