import { Fragment, useContext, useEffect, useState } from "react";
import SectionModule from "../../../components/ui/SectionModule";
import AuthContext from "../../../store/auth-context";

import Link from "next/link";

import classes from "../../../styles/allpages.module.css";

import Button from "../../../components/ui/Button";
import { getData } from "../../../lib/get-data";
import CreateSimple from "../../../components/sections/create/simple/CreateSimple";
import GetDataPage from "../../../components/sections/getdata/GetDataPage";
import CreateSlider from "../../../components/sections/create/slider/CreateSlider";
import CreateServiceBoxes from "../../../components/sections/create/service-boxes/CreateServiceBoxes";
import CreateSlideDown from "../../../components/sections/create/slide-down/CreateSlideDown";
import CreatePalns from "../../../components/sections/create/plans/CreatePlans";
import CreateTeams from "../../../components/sections/create/teams/CreateTeams";
import CreateAccordion from "../../../components/sections/create/accordion/CreateAccordion";
import CreateTable from "../../../components/sections/create/table/CreateTable";
import CreatePortfolio from "../../../components/sections/create/Portfolio/CreatePortfolio";
import SampleWorks from "../../../components/sections/create/sample-works/SampleWorks";
import CreateContactForm from "../../../components/sections/create/contact-form/CreateContactForm";
import CreateBanner from "../../../components/sections/create/banner/CreateBanner";
import CreateText from "../../../components/sections/create/simple/CreateText";
import CreateImage from "../../../components/sections/create/simple/CreateImage";
import CreateContactUsBoxes from "../../../components/sections/create/contactus-boxes/CreateContactUsBoxes";
import CreateVideo from "../../../components/sections/create/videosec/CreateVideo";
import CreateMap from "../../../components/sections/create/map/CreateMap";
import CreateBlog from "../../../components/sections/create/blog/CreateBlog";

const CreatePage = (props) => {
  const authCtx = useContext(AuthContext);
  const simpleSec = authCtx.simpleSection;
  const sliderSec = authCtx.sliderSection;
  const serviceBoxesSec = authCtx.serviceBoxesSection;
  const slideDownSec = authCtx.slideDownSection;
  const plansSec = authCtx.plansSection;
  const teamsSec = authCtx.teamsSection;
  const accordionSec = authCtx.accordionSection;
  const tableSec = authCtx.tableSection;
  const portfolioSec = authCtx.portfolioSection;
  const sampleWorksSec = authCtx.sampleWorksSection;
  const contactFormsSec = authCtx.contactFormsSection;
  const bannerSec = authCtx.bannerSection;
  const TextSec = authCtx.simpleTextSection;
  const ImageSec = authCtx.simpleImageSection;
  const contactBoxSec = authCtx.contactUsBoxesSection;
  const videoSec = authCtx.videoSection;
  const mapSec = authCtx.mapSection;
  const blogSec = authCtx.blogSection;
  const modalSec = authCtx.sectionModal;
  const showPage = authCtx.showPage;

  const [pageData, setPageData] = useState(props.data);

  console.log("cllllienttt", props.data);

  const pageId = props.pageId;

  const openModal = () => {
    authCtx.openSectionModal();
  };

  const getDataHandler = async () => {
    const dataget = await getData(`getPage/${pageId}`);

    setPageData(dataget);

    authCtx.showPageHandler();
  };

  console.log(pageData);
  return (
    <section className="dashboard">
      <div className={classes.btnsCreate}>
        <div className={classes.buttoncreate}>
          <Button onClick={openModal}>Create New Section</Button>
        </div>
        <div className={classes.viewPage}>
          <Button>
            <Link href={`/${pageId}`}>View Page</Link>
          </Button>
        </div>
      </div>
      <div>
        <Button onClick={getDataHandler}>See the latest Sections</Button>
      </div>
      {showPage && <GetDataPage data={pageData} getData={getDataHandler} />}
      {modalSec && <SectionModule />}
      {simpleSec && <CreateSimple pageId={pageId} getData={getDataHandler} />}
      {sliderSec && <CreateSlider pageId={pageId} getData={getDataHandler} />}
      {serviceBoxesSec && (
        <CreateServiceBoxes pageId={pageId} getData={getDataHandler} />
      )}
      {slideDownSec && (
        <CreateSlideDown pageId={pageId} getData={getDataHandler} />
      )}
      {plansSec && <CreatePalns pageId={pageId} getData={getDataHandler} />}
      {teamsSec && <CreateTeams pageId={pageId} getData={getDataHandler} />}
      {accordionSec && (
        <CreateAccordion pageId={pageId} getData={getDataHandler} />
      )}
      {tableSec && <CreateTable pageId={pageId} getData={getDataHandler} />}
      {portfolioSec && (
        <CreatePortfolio pageId={pageId} getData={getDataHandler} />
      )}
      {sampleWorksSec && (
        <SampleWorks pageId={pageId} getData={getDataHandler} />
      )}
      {contactFormsSec && (
        <CreateContactForm pageId={pageId} getData={getDataHandler} />
      )}
      {bannerSec && <CreateBanner pageId={pageId} getData={getDataHandler} />}
      {TextSec && <CreateText pageId={pageId} getData={getDataHandler} />}
      {ImageSec && <CreateImage pageId={pageId} getData={getDataHandler} />}
      {contactBoxSec && (
        <CreateContactUsBoxes pageId={pageId} getData={getDataHandler} />
      )}
      {videoSec && <CreateVideo pageId={pageId} getData={getDataHandler} />}
      {mapSec && <CreateMap pageId={pageId} getData={getDataHandler} />}
      {blogSec && <CreateBlog pageId={pageId} getData={getDataHandler} />}
    </section>
  );
};

export default CreatePage;

export const getServerSideProps = async (context) => {
  const { params } = context;

  const pageId = params.pageId;

  const res = await fetch(`http://api.tooskaweb.com/api/getPage/${pageId}`);
  const data = await res.json();
  const status = data.status;

  if (status === "page not found") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageId,
      data,
    },
  };
};
