import Image from "next/image";
import Link from "next/link";

import classes from "./service-boxes-section.module.css";

const ServiceBoxesSection = (props) => {
  const data = props.details.section_content;
  const title = props.details.title;

  return (
    <section className={classes.servBoxes}>
      <h2>{title}</h2>
      <div className={classes.boxes}>
        {data.map((item, index) => (
          <a href={`/${item.buttons.url}`} key={index} className={classes.box}>
            <Image
              src={item.image_url}
              alt={item.title.content}
              layout="fill"
            />
            <div className={classes.content}>
              <h3>{item.title.content}</h3>
              <p>{item.texts.content}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default ServiceBoxesSection;
