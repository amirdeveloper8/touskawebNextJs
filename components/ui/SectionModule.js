import Modal from "./Modal";
import { Container, Row, Col, Button, CloseButton } from "react-bootstrap";

import classes from "./section-module.module.css";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const SectionModule = () => {
  const authCtx = useContext(AuthContext);
  const simpleHandler = () => {
    authCtx.simpleSectionTrigger();
  };

  const sliderHandler = () => {
    authCtx.sliderSectionTrigger();
  };

  const serviceBoxesHandler = () => {
    authCtx.serviceBoxesSectionTrigger();
  };

  const slideDownHandler = () => {
    authCtx.slideDownSectionTrigger();
  };

  const plansHandler = () => {
    authCtx.plansSectionTrigger();
  };

  const teamsHandler = () => {
    authCtx.teamsSectionTrigger();
  };

  const accordionHandler = () => {
    authCtx.accordionSectionTrigger();
  };

  const tableHandler = () => {
    authCtx.tableSectionTrigger();
  };

  const portfolioHandler = () => {
    authCtx.portfolioSectionTrigger();
  };

  const sampleWorksHandler = () => {
    authCtx.sampleWorksSectionTrigger();
  };

  const contactFormsHandler = () => {
    authCtx.contactFormsSectionTrigger();
  };

  const bannerHandler = () => {
    authCtx.bannerSectionTrigger();
  };

  const TextHandler = () => {
    authCtx.simpleTextSectionTrigger();
  };

  const ImageHandler = () => {
    authCtx.simpleImageSectionTrigger();
  };

  const ContactUsBoxesHandler = () => {
    authCtx.contactUsBoxesSectionTrigger();
  };

  const VideoSectionHandler = () => {
    authCtx.videoSectionTrigger();
  };

  const MapHandler = () => {
    authCtx.mapSectionTrigger();
  };

  const blogHandler = () => {
    authCtx.blogSectionTrigger();
  };

  const closeHandler = () => {
    authCtx.closeSectionModal();
  };
  return (
    <Modal>
      <Container className={classes.sections}>
        <CloseButton
          variant="white"
          className={classes.close}
          onClick={closeHandler}
        />
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={simpleHandler} className="px-2">
              Simple
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={sliderHandler} className="px-2">
              Slider
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={serviceBoxesHandler} className="px-2">
              Service Boxes
            </Button>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={slideDownHandler} className="px-2">
              Slide Down
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={plansHandler} className="px-2">
              Plans
            </Button>
          </Col>

          <Col className="p-1 text-center">
            <Button onClick={teamsHandler} className="px-2">
              Teams
            </Button>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={accordionHandler} className="px-2">
              Accordion
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={tableHandler} className="px-2">
              Table
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={portfolioHandler} className="px-2">
              Portfolio
            </Button>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={sampleWorksHandler} className="px-2">
              Sample Works
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={contactFormsHandler} className="px-2">
              Contact Form
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={TextHandler} className="px-2">
              Simple Text
            </Button>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={ImageHandler} className="px-2">
              Simple Image
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={ContactUsBoxesHandler} className="px-2">
              Contact-us Boxes
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={bannerHandler} className="px-2">
              Banner
            </Button>
          </Col>
        </Row>
        <Row className={classes.row}>
          <Col className="p-1 text-center">
            <Button onClick={VideoSectionHandler} className="px-2">
              Video
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={MapHandler} className="px-2">
              Map
            </Button>
          </Col>
          <Col className="p-1 text-center">
            <Button onClick={blogHandler} className="px-2">
              Blog
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal>
  );
};

export default SectionModule;
