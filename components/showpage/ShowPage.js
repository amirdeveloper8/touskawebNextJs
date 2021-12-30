import SimpleSection from "../sections/SimpleSection";
import SliderSection from "../sections/SliderSection";
import ServiceBoxesSection from "../sections/ServiceBoxesSection";
import classes from "./showpage.module.css";
import SlideDownSection from "../sections/SlideDownSection";
import PlansSection from "../sections/PlansSection";
import TeamSection from "../sections/TeamSection";
import AccordionSection from "../sections/AccordionSection";
import TableSection from "../sections/TableSection";
import PortfolioSection from "../sections/PortfolioSection";
import WorkSamplesSection from "../sections/WorkSamplesSection";
import ContactFormSection from "../sections/ContactFormSection";
import BannerSection from "../sections/BannerSection";
import SimpleTxtImg from "../sections/SimpleTxtImg";
import VideoSection from "../sections/VideoSection";
import ContactUsBoxes from "../sections/ContactUsBoxes";
import MapSection from "../sections/MapSection";
import BlogSection from "../sections/BlogSection";

const ShowPage = (props) => {
  const data = props.secData;

  if (!data) {
    return <p>Loading ...</p>;
  }

  if (data.page.sections) {
    const sections = data.page.sections;
    return (
      <div>
        {sections.map((sec, index) => (
          <section key={sec.id} className={index % 2 ? "whiteSec" : "greenSec"}>
            {sec.type_id === 1 && (
              <SimpleSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 2 && (
              <SliderSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 3 && (
              <ServiceBoxesSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 4 && (
              <SlideDownSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 5 && (
              <PlansSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 6 && (
              <TeamSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 7 && (
              <AccordionSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 8 && (
              <TableSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 9 && (
              <PortfolioSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 10 && (
              <WorkSamplesSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 11 && (
              <ContactFormSection key={sec.section_content.id} details={sec} />
            )}
            {sec.type_id === 12 && (
              <BannerSection
                key={sec.section_content.id}
                details={sec.section_content}
              />
            )}
            {sec.type_id === 13 && (
              <SimpleTxtImg
                key={sec.section_content.id}
                details={sec.section_content}
                sec={sec}
              />
            )}
            {sec.type_id === 14 && (
              <ContactUsBoxes
                key={sec.section_content.id}
                details={sec.section_content}
                sec={sec}
              />
            )}

            {sec.type_id === 15 && (
              <VideoSection
                key={sec.section_content.id}
                details={sec.section_content[0]}
                sec={sec}
              />
            )}
            {sec.type_id === 16 && (
              <MapSection
                key={sec.section_content.id}
                details={sec.section_content[0]}
                sec={sec}
              />
            )}
            {sec.type_id === 17 && (
              <BlogSection
                key={sec.id}
                details={sec.section_content}
                sec={sec}
              />
            )}
          </section>
        ))}
      </div>
    );
  }
};

export default ShowPage;
