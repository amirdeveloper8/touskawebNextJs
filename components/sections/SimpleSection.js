import { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ListAccordion from "./getdata/ListAccordion";
import Button from "../ui/Button";
import Link from "next/link";

import Image from "next/image";

import classes from "./simple.module.css";

const SimpleSection = (props) => {
  const data = props.details;
  const btn = data.button[0];
  return (
    <Fragment>
      {data.section_content.map((item, index) => (
        <section className={classes.simple} key={item.texts.id}>
          <h2>{item.title}</h2>
          <div className={classes.items}>
            <div className={classes.content}>
              <ListAccordion items={item.texts.content} />
              {btn && (
                <div className="text-center my-3">
                  {btn.name && (
                    <Button>
                      <Link href={btn.url}>{btn.name}</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className={classes.image}>
              <Image
                src={item.image_url}
                alt={item.title}
                width={600}
                height={770}
                layout="responsive"
              />
            </div>
          </div>
        </section>
      ))}
    </Fragment>
  );
};

export default SimpleSection;
