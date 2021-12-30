import { Col, Container, Row } from "react-bootstrap";
import classes from "./slidedown-section.module.css";

const SlideDownSection = (props) => {
  const data = props.details.section_content;
  const title = props.details.title;

  return (
    <section className={classes.slideDownSec}>
      <h2 className="text-center py-3">{title}</h2>
      <div className={classes.boxes}>
        {data.map((item, index) => (
          <Col key={index} className={classes.box} lg={4} md={6} xs={12}>
            <div className={classes.show}>
              <h3>{item.title.content}</h3>
            </div>
            <div className={classes.hover}>
              <p>{item.texts.content}</p>
            </div>
          </Col>
        ))}
      </div>
    </section>
  );
};

export default SlideDownSection;
