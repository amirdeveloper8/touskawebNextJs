import { Classnames } from "react-alice-carousel";
import { Accordion, Container } from "react-bootstrap";
import ListAccordion from "./getdata/ListAccordion";

import classes from "./accordion.module.css";

const AccordionSection = (props) => {
  const title = props.details.title;
  const content = props.details.section_content;

  return (
    <section className={classes.accordionSec}>
      <h2>{title}</h2>
      <Accordion className={classes.accordion} defaultActiveKey="0">
        {content.map((item, index) => (
          <Accordion.Item
            className={classes.accordionItem}
            key={index}
            eventKey={index}
          >
            <Accordion.Header>{item.title.content}</Accordion.Header>
            <Accordion.Body className={classes.accordionBody}>
              <ListAccordion items={item.texts.content} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
};

export default AccordionSection;
