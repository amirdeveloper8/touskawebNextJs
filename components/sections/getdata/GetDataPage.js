import { useContext, useRef, useState } from "react";
import {
  CloseButton,
  Alert,
  Button,
  Tab,
  Row,
  Col,
  Nav,
} from "react-bootstrap";
import AuthContext from "../../../store/auth-context";
import classes from "./getdatapage.module.css";
import { BiEdit } from "react-icons/bi";
import { FcAddRow } from "react-icons/fc";
import UpdateSimple from "../updatemodules/UpdateSimple";
import UpdateAll from "../updatemodules/UpdateAll";
import UpdatePlans from "../updatemodules/UpdatePlans";
import UpdateTeams from "../updatemodules/UpdateTeams";
import AddAll from "../addnew/all/AddAll";
import ListAccordion from "./ListAccordion";
import UpdateAccordion from "../updatemodules/UpdateAccordion";
import AddAccordion from "../addnew/accordion/AddAccordion";
import AddPlans from "../addnew/plans/AddPlans";
import AddTeam from "../addnew/teams/AddTeam";
import GetTabs from "./table/GetTabs";
import GetTable from "./table/GetTable";
import GetTh from "./table/getTh";
import GetCms from "./table/GetCms";
import GetTf from "./table/GetTf";
import GetTitlesTable from "./table/GetTitlesTable";
import UpdateTable from "./table/UpdateTable";
import AddTable from "../addnew/table/AddTable";
import UpdatePortfolio from "../updatemodules/UpdatePortfolio";
import AddPortfolio from "../addnew/potfolio/AddAll";
import UpdateWorkSamples from "../updatemodules/UpdateWorkSamples";
import AddSampleWorks from "../addnew/sampleworks/addSampleWorks";
import UpdateContactForm from "../updatemodules/contact-form/UpdateContactForm";
import AddInputForms from "../addnew/contact-form/AddInputForms";
import UpdateHeadContactForm from "../updatemodules/contact-form/UpdateHeadContactForm";
import UpdateBanner from "../updatemodules/UpdateBanner";
import UpdateTxtImg from "../updatemodules/UpdateTxtImg";

import { Markup } from "interweave";

import AddContactUsBoxes from "../addnew/contactus-boxes/AddContactUsBoxes";

import Link from "next/link";

import { RiMapPinFill } from "react-icons/ri";
import { RiPhoneFill } from "react-icons/ri";
import { MdMail } from "react-icons/md";

import { BsTelephone } from "react-icons/bs";
import { BsWhatsapp } from "react-icons/bs";
import { RiMapPin2Line } from "react-icons/ri";
import { AiOutlineInstagram } from "react-icons/ai";
import { AiOutlineMail } from "react-icons/ai";
import { RiTwitterLine } from "react-icons/ri";
import { FiLinkedin } from "react-icons/fi";

import UpdateContactBoxes from "../updatemodules/contact-boxes/UpdateContactBoxes";
import UpdateEmailContactForm from "../updatemodules/contact-form/UpdateEmailContactForm";
import DeleteAll from "../delete/DeleteAll";
import DeleteSingle from "../delete/DeleteSingle";
import OrderSec from "../order/OrderSec";
import UpdateTitleSub from "../updatemodules/UpdateTitleSub";
import AddSlider from "../addnew/slider/AddSlider";
import UpdateButtons from "../updatemodules/UpdateButtons";
import UpdateVideo from "../updatemodules/UpdateVideo";
import UpdateBlog from "../updatemodules/UpdateBlog";
import Image from "next/image";

const GetDataPage = (props) => {
  const [updateOne, setUpdateOne] = useState(false);
  const [addNew, setaddNew] = useState(false);
  const authCtx = useContext(AuthContext);
  const closeBtnRef = useRef();

  const getData = () => props.getData();

  if (!props.data) {
    return (
      <Alert variant="danger" className="m-2">
        <h2>No Section!</h2>
      </Alert>
    );
  }

  const updateSectionHandler = (event) => {
    const parent = event.target.parentElement;
    parent.setAttribute("id", "updateSection");
    console.log(parent);
    setUpdateOne(true);
  };

  const noUpdateHandler = (event) => {
    const parent = event.target.parentElement.parentElement;
    parent.setAttribute("id", "updatenone");
    setUpdateOne(false);
  };

  const addColumnHandler = (event) => {
    const parent = event.target.parentElement.parentElement;
    parent.setAttribute("id", "addNew");
    setaddNew(true);
  };

  const deleteSecHandler = (id, rel) => {
    console.log("id", id);
    console.log("rel", rel);
  };

  if (props.data.page.sections) {
    const sections = props.data.page.sections;
    const pageId = props.data.page.id;
    console.log(sections);

    return (
      <section className={classes.page}>
        <h1>Content Of Page</h1>

        {sections.map((sec) => (
          <div
            key={sec.id}
            className={
              sec.type_id === 1
                ? `${classes.section} ${classes.simpleSec}`
                : `${classes.section}`
            }
          >
            <DeleteAll id={sec.id} type={sec.type.name} getData={getData} />
            <div className={classes.typeSec}>
              <h2>type:{sec.type.name}</h2>
            </div>
            <OrderSec data={sec} pageId={pageId} />

            {sec.type_id !== 11 && sec.type_id !== 5 && (
              <UpdateTable
                data={sec.title}
                tableId={sec.id}
                getData={getData}
              />
            )}
            {sec.type_id === 5 && (
              <UpdateTitleSub data={sec} getData={getData} />
            )}
            {sec.type_id === 11 && (
              <UpdateHeadContactForm data={sec} getData={getData} />
            )}
            {sec.type_id === 11 && (
              <UpdateEmailContactForm data={sec} getData={getData} />
            )}
            {sec.type_id === 17 && sec.subtitle && (
              <div>
                <h5 className="text-center">
                  subtitle:
                  <br />
                  {sec.subtitle}
                </h5>
              </div>
            )}

            {sec.type_id !== 6 &&
              sec.type_id !== 8 &&
              sec.type_id !== 10 &&
              sec.type_id !== 11 &&
              sec.type_id !== 13 &&
              sec.type_id !== 14 &&
              sec.type_id !== 17 &&
              sec.section_content.map((item, index) => (
                <div ref={closeBtnRef} key={index} className={classes.content}>
                  {sec.type_id !== 15 && sec.type_id !== 16 && (
                    <DeleteSingle
                      box={item}
                      type={sec.type.name}
                      id={sec.type.id}
                      secId={sec.id}
                    />
                  )}
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                  <div className={`${classes.details} details`}>
                    {sec.type_id !== 7 && sec.type_id !== 9 && item.image_url && (
                      <div>
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image_url}
                        />
                      </div>
                    )}
                    {sec.type_id !== 7 && sec.type_id === 9 && item.image && (
                      <div>
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image}
                        />
                      </div>
                    )}
                    <div
                      className={
                        sec.type_id === 7 ? classes.accordion : "w-100"
                      }
                    >
                      <h3 className="text-center">
                        {sec.type_id === 1 ||
                        sec.type_id === 15 ||
                        sec.type_id === 16
                          ? item.title
                          : item.title.content}
                      </h3>
                      {/* <h4>{item.title.subtitle}</h4> */}
                      <p>
                        {sec.type_id !== 5 &&
                          sec.type_id !== 1 &&
                          sec.type_id !== 2 &&
                          sec.type_id !== 7 &&
                          sec.type_id !== 9 &&
                          sec.type_id !== 12 &&
                          sec.type_id !== 15 &&
                          sec.type_id !== 16 &&
                          item.texts.content}
                        {sec.type_id === 5 && item.title.subtitle}
                      </p>
                      {(sec.type_id === 7 ||
                        sec.type_id === 1 ||
                        sec.type_id === 2) && (
                        <div className={classes.ListAccordionItems}>
                          <ListAccordion items={item.texts.content} />
                        </div>
                      )}
                      {sec.type_id === 12 && item.subtitle && (
                        <ListAccordion items={item.subtitle} />
                      )}
                      {sec.type_id === 15 && (
                        <p className="text-right w-100">{sec.subtitle}</p>
                      )}
                      {sec.type_id === 15 ||
                        (sec.type_id === 16 && (
                          <p className="text-right w-100 bg-primary p-2">
                            Src: <span className="bg-light">{item.src}</span>
                          </p>
                        ))}
                      {sec.type_id === 5 && (
                        <ul>
                          {JSON.parse(item.item.lists).map((list, idx) => (
                            <li key={idx}>{list}</li>
                          ))}
                          <Button variant="light">
                            <Link href={`/${item.button.url}`}>
                              {item.button.name}
                            </Link>
                          </Button>
                          <a href={`/${item.button.url}`}>
                            href: {item.button.url}
                          </a>
                        </ul>
                      )}
                      {sec.type_id === 5 ||
                        (sec.type_id === 9 && (
                          <p className="text-primary">
                            button name: {item.button.name}
                          </p>
                        ))}
                      {sec.type_id === 5 ||
                        (sec.type_id === 9 && (
                          <p className="text-primary">
                            button url: {item.button.url}
                          </p>
                        ))}
                    </div>
                  </div>
                  <div className="updateForm">
                    {(sec.type_id === 1 || sec.type_id === 2) && updateOne && (
                      <UpdateSimple
                        richTxt={item.texts.content}
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {sec.type_id === 5 && updateOne && (
                      <UpdatePlans
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {sec.type_id === 7 && updateOne && (
                      <UpdateAccordion
                        richTxt={item.texts.content}
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {sec.type_id === 9 && updateOne && (
                      <UpdatePortfolio
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {sec.type_id === 12 && updateOne && (
                      <UpdateBanner
                        richTxt={item.subtitle}
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {(sec.type_id === 15 || sec.type_id === 16) && (
                      <UpdateVideo
                        updateData={item}
                        sec={sec}
                        getData={getData}
                      />
                    )}
                    {sec.type_id !== 1 &&
                      sec.type_id !== 2 &&
                      sec.type_id !== 5 &&
                      sec.type_id !== 7 &&
                      sec.type_id !== 9 &&
                      sec.type_id !== 12 &&
                      sec.type_id !== 15 &&
                      sec.type_id !== 16 &&
                      updateOne && (
                        <UpdateAll
                          updateData={item}
                          sec={sec}
                          getData={getData}
                        />
                      )}

                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                </div>
              ))}
            {sec.type_id === 6 &&
              sec.section_content.map((item, index) => (
                <div ref={closeBtnRef} key={index} className={classes.content}>
                  <DeleteSingle
                    box={item}
                    type={sec.type.name}
                    id={sec.type.id}
                    secId={sec.id}
                  />
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                  <div className={`${classes.details} details`}>
                    <div>
                      {item.image_url && (
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image_url}
                        />
                      )}
                    </div>
                    <div>
                      <h3>Name: {item.name}</h3>

                      <p>Post: {item.post}</p>
                      <p>Character: {item.charecter}</p>
                      <ul>
                        {" "}
                        Social Url :
                        {item.socials.map((social) => (
                          <li key={social.id}>{social.url}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="updateForm">
                    {updateOne && <UpdateTeams updateData={item} sec={sec} />}
                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                </div>
              ))}
            {sec.type_id === 8 && (
              <section className={classes.editTable}>
                <Tab.Container id="left-tabs-example" defaultActiveKey="table1">
                  <Row className={classes.tableGet}>
                    <Col sm={12}>
                      <Nav className="mx-3" variant="pills">
                        {sec.section_content.tab.map((item, index) => (
                          <GetTabs
                            key={index}
                            number={index + 1}
                            data={item}
                            tableId={sec.section_content.id}
                          />
                        ))}
                      </Nav>
                    </Col>
                    <Col sm={12}>
                      <GetTitlesTable
                        data={sec.section_content.titleHeader}
                        tableId={sec.section_content.id}
                        type="titleHeader"
                      />

                      <GetTh
                        data={JSON.parse(sec.section_content.th)}
                        tableId={sec.section_content.id}
                      />
                    </Col>
                    <Col sm={12}>
                      <Tab.Content>
                        {sec.section_content.tab.map((item, index) => (
                          <GetTable
                            key={index}
                            number={index + 1}
                            data={item}
                            tableId={sec.section_content.id}
                          />
                        ))}
                      </Tab.Content>
                    </Col>
                    <Col sm={12}>
                      <GetTitlesTable
                        data={sec.section_content.titleFooter}
                        tableId={sec.section_content.id}
                        type="titleFooter"
                      />
                      <GetTf
                        data={JSON.parse(sec.section_content.tf)}
                        tableId={sec.section_content.id}
                      />
                    </Col>
                  </Row>
                  <Row className={classes.tableGet}>
                    <Col sm={12}>
                      <GetCms
                        data={JSON.parse(sec.section_content.comments)}
                        tableId={sec.section_content.id}
                      />
                    </Col>
                  </Row>
                </Tab.Container>
              </section>
            )}
            {sec.type_id === 10 &&
              sec.section_content.map((item, index) => (
                <section key={index} className={classes.worksamples}>
                  <DeleteSingle
                    box={item}
                    type={sec.type.name}
                    id={sec.type.id}
                    secId={sec.id}
                    getData={getData}
                  />
                  <div className={`details ${classes.worksampleItems}`}>
                    <div className={classes.boxWorksamples}>
                      <h3>Box Items:</h3>
                      <h4>title : {item.title_box}</h4>
                      {item.image_box_url && (
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image_box_url}
                        />
                      )}
                    </div>
                    <div className={classes.prjWorksamples}>
                      <h3>Project Items:</h3>
                      <h4>title: {item.title_project}</h4>
                      <h5>name: {item.name_project}</h5>
                      <p>
                        url:{" "}
                        <a href={`/${item.url_project}`}>{item.url_project}</a>
                      </p>
                      <p>button name: {item.buttons.name}</p>
                      {item.image_project_url && (
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image_project_url}
                        />
                      )}
                    </div>
                  </div>

                  <div className="updateForm">
                    {updateOne && (
                      <UpdateWorkSamples updateData={item} sec={sec} />
                    )}
                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                </section>
              ))}
            {sec.type_id === 11 &&
              sec.section_content.map((item, index) => (
                <section key={index} className={classes.contactforms}>
                  <DeleteSingle
                    box={item}
                    type={sec.type.name}
                    id={sec.type.id}
                    secId={sec.id}
                    getData={getData}
                  />
                  <div className={`details ${classes.contactformItems}`}>
                    <h3>type: {item.type_namee}</h3>
                    <h5>Name: {item.name}</h5>
                    <p>label: {item.label}</p>
                    <p>placeholder: {item.placeholder}</p>
                    {JSON.parse(item.options).length !== 0 && (
                      <ul>
                        options:
                        {JSON.parse(item.options).map((option, index) => (
                          <li key={index}>{option}</li>
                        ))}
                        {/* {item.options} */}
                      </ul>
                    )}
                    <p>valid: {item.valid ? item.valid : "false"}</p>
                  </div>

                  <div className="updateForm">
                    {updateOne && (
                      <UpdateContactForm updateData={item} sec={sec} />
                    )}
                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                </section>
              ))}
            {sec.type_id === 13 &&
              sec.section_content.map((item, index) => (
                <div ref={closeBtnRef} key={index} className={classes.content}>
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                  <div className={`${classes.details} details`}>
                    <div className={classes.simpleTxtImg}>
                      {item.image_url && (
                        <Image
                          width={300}
                          height={250}
                          alt="image-update"
                          src={item.image_url}
                        />
                      )}
                      {item.subtitle && <ListAccordion items={item.subtitle} />}
                    </div>
                  </div>
                  <div className="updateForm">
                    {updateOne && (
                      <UpdateTxtImg
                        richTxt={item.subtitle}
                        updateData={item}
                        sec={sec}
                      />
                    )}

                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                </div>
              ))}
            {sec.type_id === 14 &&
              sec.section_content.map((item, index) => (
                <div ref={closeBtnRef} key={index} className={classes.content}>
                  <DeleteSingle
                    box={item}
                    type={sec.type.name}
                    id={sec.type.id}
                    secId={sec.id}
                    getData={getData}
                  />
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                  <div className={`${classes.contactUsBoxes} details`}>
                    <div className={classes.contactUsBoxesIcon}>
                      {item.type_box === "tel" && <RiPhoneFill />}
                      {item.type_box === "adress" && <RiMapPinFill />}
                      {item.type_box === "socials" && <MdMail />}
                    </div>
                    <h4>{item.title}</h4>
                    <div className={classes.contactUsBoxesItems}>
                      <div className={classes.contactLinkUrls}>
                        {item.social_urls.map((social) => (
                          <div key={social.id}>
                            {social.type.type === "url" &&
                              social.type.name === "tel" && (
                                <>
                                  <Link href={`tel:${social.url}`}>
                                    {social.name}
                                  </Link>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "url" &&
                              social.type.name === "email" && (
                                <>
                                  <Link href={`mailto:${social.url}`}>
                                    {social.name}
                                  </Link>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "url" &&
                              social.type.name !== "email" &&
                              social.type.name !== "tel" && (
                                <>
                                  <Link
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    {social.name}
                                  </Link>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                          </div>
                        ))}
                      </div>
                      <div className={classes.contactLinkIcons}>
                        {item.social_urls.map((social) => (
                          <div key={social.id}>
                            {social.type.type === "icon" &&
                              social.type.name === "tel" && (
                                <>
                                  <a href={`tel:${social.url}`}>
                                    <BsTelephone />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "email" && (
                                <>
                                  <a href={`mailto:${social.url}`}>
                                    <AiOutlineMail />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "linkdin" && (
                                <>
                                  <a
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    <FiLinkedin />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "instagram" && (
                                <>
                                  <a
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    <AiOutlineInstagram />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "address" && (
                                <>
                                  <a
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    <RiMapPin2Line />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "twitter" && (
                                <>
                                  <a
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    <RiTwitterLine />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                            {social.type.type === "icon" &&
                              social.type.name === "whatsapp" && (
                                <>
                                  <a
                                    href={
                                      social.url.includes("http")
                                        ? social.url
                                        : `https://${social.url}`
                                    }
                                  >
                                    <BsWhatsapp />
                                  </a>
                                  <p> url : {social.url}</p>
                                </>
                              )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="updateForm">
                    {updateOne && (
                      <UpdateContactBoxes updateData={item} sec={sec} />
                    )}
                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                </div>
              ))}

            {sec.type_id === 17 && (
              <div>
                {sec.section_content.blogs.map((item, index) => (
                  <div
                    ref={closeBtnRef}
                    key={index}
                    className={classes.content}
                  >
                    <div
                      className={classes.fakeBtn}
                      onClick={updateSectionHandler}
                    ></div>
                    <div className={`${classes.details} details`}>
                      <div>
                        <h3>{item.title}</h3>

                        <Markup content={item.excerpt} />
                        {item.image_link && (
                          <Image
                            width={300}
                            height={250}
                            alt="image-update"
                            src={item.image_link}
                          />
                        )}
                        <Button variant="info">
                          <Link href={item.link}>view more</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="d-block w-75 m-auto" dir="ltr">
                  <Button variant="success">
                    {sec.section_content.button.name}
                  </Button>
                  <p className="text-left">
                    button url: <br />
                    <Link href={sec.section_content.button.url}>
                      {sec.section_content.button.url}
                    </Link>
                  </p>
                  <div className="updateForm">
                    {updateOne && <UpdateBlog data={sec} />}
                    <CloseButton
                      className={classes.closeBtn}
                      onClick={noUpdateHandler}
                    />
                  </div>
                  <div className={classes.editBtn}>
                    <BiEdit />
                  </div>
                  <div
                    className={classes.fakeBtn}
                    onClick={updateSectionHandler}
                  ></div>
                </div>
              </div>
            )}

            <div className="addnewcol">
              <div className="addForm">
                {sec.type_id === 2 && addNew && (
                  <AddSlider secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 5 && addNew && (
                  <AddPlans secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 6 && addNew && (
                  <AddTeam secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 7 && addNew && (
                  <AddAccordion secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 9 && addNew && (
                  <AddPortfolio secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 10 && addNew && (
                  <AddSampleWorks secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 11 && addNew && (
                  <AddInputForms secId={sec.id} typeId={sec.type_id} />
                )}
                {sec.type_id === 14 && addNew && (
                  <AddContactUsBoxes secId={sec.id} typeId={sec.type_id} />
                )}

                {(sec.type_id === 3 || sec.type_id === 4) && addNew && (
                  <AddAll secId={sec.id} typeId={sec.type_id} />
                )}
                <CloseButton
                  className={classes.closeBtn}
                  onClick={noUpdateHandler}
                />
              </div>
              <div className="addTable">
                {sec.type_id === 8 && addNew && (
                  <AddTable
                    tableId={sec.section_content.id}
                    numberOfColumns={JSON.parse(sec.section_content.th).length}
                    typeId={sec.type_id}
                  />
                )}
              </div>
              {sec.type_id !== 1 &&
                sec.type_id !== 12 &&
                sec.type_id !== 15 &&
                sec.type_id !== 16 &&
                sec.type_id !== 17 && (
                  <div className={classes.addColumn}>
                    <button
                      type="button"
                      onClick={addColumnHandler}
                      value={sec.type_id}
                    ></button>
                    <FcAddRow />
                  </div>
                )}
            </div>
            {(sec.type_id === 8 || sec.type_id === 1 || sec.type_id === 13) &&
              sec.button.length !== 0 && <UpdateButtons data={sec} />}
          </div>
        ))}
      </section>
    );
  }
};

export default GetDataPage;
