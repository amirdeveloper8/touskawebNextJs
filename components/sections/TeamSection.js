import Link from "next/link";
import AliceCarousel, { Classnames } from "react-alice-carousel";
import { SiTwitter, SiInstagram } from "react-icons/si";
import "react-alice-carousel/lib/alice-carousel.css";
import classes from "./teamsection.module.css";
import Image from "next/image";

const TeamSection = (props) => {
  const boxes = props.details.section_content;
  let urls = [];
  urls = boxes.socials;

  const items = boxes.map((box, index) => (
    <section className={classes.box} key={box.id}>
      <div className={classes.imgPerson}>
        <Image
          className={classes.imgteam}
          src={box.image_url}
          width={200}
          height={200}
          alt={box.name}
        />
      </div>
      <div className={classes.namepost}>
        <h3>{box.name}</h3>
      </div>
      <div className={classes.char}>
        <h6>{box.post}</h6>
      </div>
      <div className={classes.social}>
        {box.socials.map((social, index) => (
          <div key={index}>
            {social.url.includes("twitter") && (
              <a href={social.url}>
                <SiTwitter className={classes.twitter} />
              </a>
            )}
            {social.url.includes("instagram") && (
              <a
                href={
                  social.url.includes("http")
                    ? social.url
                    : `https://${social.url}`
                }
              >
                <SiInstagram className={classes.instagram} />
              </a>
            )}
          </div>
        ))}
      </div>
      <div className={classes.personal}>
        <p>{box.charecter}</p>
      </div>
    </section>
  ));

  const responsive = {
    0: { items: 1 },
    768: { items: 3 },
    1200: { items: 4 },
    1800: { items: 5 },
  };
  return (
    <section className={classes.carousel}>
      <h2 className="text-center m-5" dir="rtl">
        {props.details.title}
      </h2>
      <AliceCarousel
        mouseTracking
        items={items}
        responsive={responsive}
        autoPlayInterval={2000}
        autoPlay={true}
        fadeOutAnimation={true}
        mouseTrackingEnabled={true}
        disableButtonsControls={true}
        infinite={true}
      />
    </section>
  );
};

export default TeamSection;
