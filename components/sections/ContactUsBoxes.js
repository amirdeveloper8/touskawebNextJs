import classes from "./contactUsBoxes.module.css";

import { MdPhone } from "react-icons/md";
import { MdPlace } from "react-icons/md";
import { MdMail } from "react-icons/md";

import { FiLinkedin } from "react-icons/fi";
import { RiTwitterLine } from "react-icons/ri";
import { AiOutlineMail } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsWhatsapp } from "react-icons/bs";
import { RiMapPin2Line } from "react-icons/ri";
import { BsTelephone } from "react-icons/bs";

const ContactUsBoxes = (props) => {
  const data = props.details;
  const values = props.sec;
  return (
    <section className={classes.contactusboxes}>
      <h2>{values.title}</h2>
      <div className={classes.boxes}>
        {data.map((item) => (
          <div className={classes.box} key={item.id}>
            <div className={classes.icons}>
              {item.type_box === "adress" && (
                <MdPlace className={classes.iconType} />
              )}
              {item.type_box === "tel" && (
                <MdPhone className={classes.iconType} />
              )}
              {item.type_box === "socials" && (
                <MdMail className={classes.iconType} />
              )}
            </div>
            <h3>{item.title}</h3>
            <div className={classes.urlSocials}>
              {item.social_urls.map((social) => (
                <div key={social.id} className={classes.urlSocial}>
                  {social.type.type === "url" && social.type.name === "tel" && (
                    <a href={`tel:${social.url}`}>{social.name}</a>
                  )}
                  {social.type.type === "url" &&
                    social.type.name === "mail" && (
                      <a href={`mailto:${social.url}`}>{social.name}</a>
                    )}
                  {social.type.type === "url" &&
                    social.type.name !== "mail" &&
                    social.type.name !== "tel" && (
                      <a href={social.url}>{social.name}</a>
                    )}
                </div>
              ))}
            </div>
            <div className={classes.iconSocials}>
              {item.social_urls.map((social) => (
                <div key={social.id} className={classes.iconSocial}>
                  {social.type.type === "icon" &&
                    social.type.name === "linkdin" && (
                      <a href={social.url}>
                        <FiLinkedin />
                      </a>
                    )}
                  {social.type.type === "icon" &&
                    social.type.name === "instagram" && (
                      <a href={social.url}>
                        <AiOutlineInstagram />
                      </a>
                    )}
                  {social.type.type === "icon" && social.type.name === "tel" && (
                    <a href={`tel:${social.url}`}>
                      <BsTelephone />
                    </a>
                  )}
                  {social.type.type === "icon" && social.type.name === "mail" && (
                    <a href={`mailto:${social.url}`}>
                      <AiOutlineMail />
                    </a>
                  )}
                  {social.type.type === "icon" &&
                    social.type.name === "twitter" && (
                      <a href={social.url}>
                        <RiTwitterLine />
                      </a>
                    )}
                  {social.type.type === "icon" &&
                    social.type.name === "adress" && (
                      <a href={social.url}>
                        <RiMapPin2Line />
                      </a>
                    )}
                  {social.type.type === "icon" &&
                    social.type.name === "whatsapp" && (
                      <a href={social.url}>
                        <BsWhatsapp />
                      </a>
                    )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContactUsBoxes;
