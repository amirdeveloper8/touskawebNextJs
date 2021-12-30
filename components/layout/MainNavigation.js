import {
  Col,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import Image from "next/image";

import Link from "next/link";

import classes from "./layout.module.css";

import { BsPersonCircle } from "react-icons/bs";
import { Fragment, useEffect, useState } from "react";
import { getData } from "../../lib/get-data";

const MainNavigation = (props) => {
  const [menuList, setMenuList] = useState([]);
  const [menuButton, setMenuButton] = useState();
  const [menuLogo, setMenuLogo] = useState();

  // const [list1, setList1] = useState([]);
  // const [list2, setList2] = useState([]);

  let list1 = [];
  let list2 = [];

  useEffect(() => {
    const fetchData = async () => {
      const dataget = await getData("get/header");
      if (dataget.header) {
        setMenuList(dataget.header.list_menu);
        setMenuButton(dataget.header.button.url);
        setMenuLogo(dataget.header.logo_url);
      } else {
        setMenuList([]);
        setMenuButton("");
        setMenuLogo("");
      }
    };

    fetchData();
  }, []);

  for (let i = 0; i < Math.ceil(menuList.length / 2); i++) {
    list1[i] = menuList[i];
  }

  for (let i = Math.ceil(menuList.length / 2); i < menuList.length; i++) {
    list2[i] = menuList[i];
  }

  return (
    <Fragment>
      {menuList.length > 0 && (
        <Navbar className={`orgnavbar ${classes.menu}`} variant="dark">
          <div className={`${classes.firstMenu} ${classes.menuItems}`} lg={4}>
            {list1.map((item, index) =>
              item.sub.length === 0 ? (
                <div key={item.url} className={classes.menuItem}>
                  <a href={`/${item.url}`}>{item.name}</a>
                </div>
              ) : (
                <div
                  key={index}
                  className={`${classes.menuDropdown} ${classes.menuItem}`}
                >
                  <a className={classes.dropItem} href={item.url}>
                    {item.name}
                  </a>
                  <ul>
                    {item.sub.map((child, idx) => (
                      <li key={idx}>
                        <a href={`/${child.url}`}>{child.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>

          <div className={classes.menuCol} lg={2}>
            <Navbar.Brand className={classes.logoImg} href="/">
              {menuLogo && (
                <Image
                  width={300}
                  height={220}
                  alt="Touskaweb"
                  src={menuLogo}
                />
              )}
            </Navbar.Brand>
          </div>
          <div className={`${classes.secondMenu} ${classes.menuItems}`} lg={4}>
            {list2.map((item, index) =>
              item.sub.length === 0 ? (
                <div key={item.url} className={classes.menuItem}>
                  <a href={item.url}>{item.name}</a>
                </div>
              ) : (
                <div
                  key={index}
                  className={`${classes.menuDropdown} ${classes.menuItem}`}
                >
                  <a className={classes.dropItem} href={item.url}>
                    {item.name}
                  </a>
                  <ul>
                    {item.sub.map((child, idx) => (
                      <li key={idx}>
                        <a href={child.url}>{child.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
          {menuButton && (
            <a className={classes.iconBtn} href={menuButton}>
              <BsPersonCircle />
            </a>
          )}
        </Navbar>
      )}
      {menuList.length > 0 && (
        <Navbar className={classes.mobileMenu} bg="light" expand={false}>
          <Container fluid>
            <Navbar.Brand className={classes.logMobile} href="/">
              {menuLogo && (
                <Image width={100} height={70} alt="Touskaweb" src={menuLogo} />
              )}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
            <Navbar.Offcanvas
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
              placement="end"
              className={classes.burgerMenu}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title
                  className={classes.logMobile}
                  id="offcanvasNavbarLabel"
                >
                  {menuLogo && (
                    <Image
                      width={100}
                      height={70}
                      alt="Touskaweb"
                      src={menuLogo}
                    />
                  )}
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {menuList.map((item, index) =>
                    item.sub.length === 0 ? (
                      <Nav.Link key={item.url} href={item.url}>
                        {item.name}
                      </Nav.Link>
                    ) : (
                      <NavDropdown
                        key={index}
                        title={item.name}
                        id={`offcanvasNavbarDropdown${index}`}
                        className={classes.dropMobile}
                      >
                        {item.sub.map((child, idx) => (
                          <NavDropdown.Item key={child.url} href={child.url}>
                            {child.name}
                          </NavDropdown.Item>
                        ))}
                      </NavDropdown>
                    )
                  )}
                  {menuButton && (
                    <a className={classes.iconBtn} href={menuButton}>
                      <BsPersonCircle />
                    </a>
                  )}
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
    </Fragment>
  );
};

export default MainNavigation;
