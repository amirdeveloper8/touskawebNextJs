import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../../components/ui/Button";
import { CloseButton, Col, Row } from "react-bootstrap";
import ConnectToDB from "../../../lib/connect-to-db";
import { getData } from "../../../lib/get-data";
import CreateMenu from "../../../components/header/create-menu/CreateMenu";

import classes from "../../../styles/dashboard.module.css";
import CreateHeader from "../../../components/header/create-header/CreateHeader";
import AuthContext from "../../../store/auth-context";
import UpdateMenu from "../../../components/header/update-menu/UpdateMenu";
import UpdateHeader from "../../../components/header/create-header/UpdateHeader";
const Menu = (props) => {
  const [menuGet, setMenuGet] = useState(props.menuData.status);
  const [headerGet, setHeaderGet] = useState(props.headerData.status);
  const [createMenu, setCreateMenu] = useState(false);
  const [createHeader, setCreateHeader] = useState();

  const [menuData, setMenuData] = useState(props.menuData.menus);
  const [headerData, setHeaderData] = useState(props.headerData.header);

  const authCtx = useContext(AuthContext);

  const showPage = authCtx.showPage;

  // useEffect(async () => {
  //   const menuDetails = await getData("get/menus");
  //   setMenuData(menuDetails.menus);
  //   setMenuGet(menuDetails.status);
  //   const headerDetails = await getData("get/header");
  //   setHeaderData(headerDetails.header);
  //   setHeaderGet(headerDetails.status);
  // }, [showPage]);

  return (
    <section className="dashboard py-4">
      {showPage && (
        <Row className={classes.headerItems}>
          <Col className={classes.headerItem} lg={12}>
            {menuGet === "not found" && (
              <div>
                {!createMenu && (
                  <Button
                    className={classes.openItemMenu}
                    onClick={() => setCreateMenu(true)}
                  >
                    Create Menu
                  </Button>
                )}
                {createMenu && <CreateMenu />}
              </div>
            )}
            {menuGet !== "not found" && (
              <div>
                {!createMenu && (
                  <Button
                    className={classes.openItemMenu}
                    onClick={() => setCreateMenu(true)}
                  >
                    Update Menu
                  </Button>
                )}
                {createMenu && <UpdateMenu data={menuData} />}
              </div>
            )}
            {createMenu && (
              <CloseButton
                className={classes.closeMenu}
                onClick={() => setCreateMenu(false)}
              />
            )}
          </Col>

          <Col className={classes.headerItem} lg={12}>
            {headerGet === "not found" && menuGet !== "not found" && (
              <div>
                {!createHeader && (
                  <Button
                    className={classes.openItemMenu}
                    onClick={() => setCreateHeader(true)}
                  >
                    Create Header
                  </Button>
                )}
                {createHeader && <CreateHeader />}
              </div>
            )}
            {headerGet !== "not found" && (
              <div>
                {!createHeader && (
                  <Button
                    className={classes.openItemMenu}
                    onClick={() => setCreateHeader(true)}
                  >
                    Update Header
                  </Button>
                )}
                {createHeader && <UpdateHeader item={headerData} />}
              </div>
            )}
            {createHeader && (
              <CloseButton
                className={classes.closeMenu}
                onClick={() => setCreateHeader(false)}
              />
            )}
          </Col>
        </Row>
      )}
    </section>
  );
};

export const getServerSideProps = async (context) => {
  const response = await fetch(`http://api.tooskaweb.com/api/get/header`);
  const headerData = await response.json();

  const res = await fetch(`http://api.tooskaweb.com/api/get/menus`);
  const menuData = await res.json();

  return {
    props: {
      menuData,
      headerData,
    },
  };
};

export default Menu;
