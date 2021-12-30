import { useContext, useEffect, useState } from "react";
import { CloseButton } from "react-bootstrap";
import CreateItems from "../../../components/plans/CreateItems";
import CreatePlans from "../../../components/plans/CreatePlans";
import UpdateItems from "../../../components/plans/UpdateItems";
import UpdatePlans from "../../../components/plans/UpdatePlans";
import Button from "../../../components/ui/Button";
import { getData } from "../../../lib/get-data";
import AuthContext from "../../../store/auth-context";

import classes from "../../../styles/dashboard.module.css";

const Plans = (props) => {
  const [createCats, setCreateCats] = useState(false);
  const [updateCats, setUpdateCats] = useState(false);
  const [createItems, setCreateItems] = useState(false);
  const [updateItems, setUpdateItems] = useState(false);
  const [catDetails, setCatDetails] = useState(props.valCats.cats);
  const [itemDetails, setItemDetails] = useState(props.valItem);

  const authCtx = useContext(AuthContext);
  const showPage = authCtx.showPage;

  // useEffect(async () => {
  //   const valCats = await getData("get/semiplan/cat");
  //   const valItem = await getData("get/semiplan/item");

  //   setCatDetails(valCats.cats);
  //   setItemDetails(valItem);
  //   setCreateCats(false);
  // }, [showPage]);

  console.log("cats", catDetails);
  console.log("item", itemDetails);

  return (
    <section className="dashboard">
      {showPage && (
        <div className={classes.createPlans}>
          {!createCats && (
            <Button
              className={classes.createBtnPlans}
              onClick={() => setCreateCats(true)}
            >
              Create Plans
            </Button>
          )}
          {createCats && <CreatePlans />}
          {createCats && (
            <CloseButton
              className={classes.closePlans}
              onClick={() => setCreateCats(false)}
            />
          )}
        </div>
      )}
      {showPage && catDetails.length !== 0 && (
        <div className={classes.createPlans}>
          {!updateCats && (
            <Button
              className={classes.updateBtnPlans}
              onClick={() => setUpdateCats(true)}
            >
              Update Plans
            </Button>
          )}
          {updateCats && <UpdatePlans value={catDetails} />}
          {updateCats && (
            <CloseButton
              className={classes.closePlans}
              onClick={() => setUpdateCats(false)}
            />
          )}
        </div>
      )}

      {showPage && (
        <div className={classes.createPlans}>
          {!createItems && (
            <Button
              className={classes.createBtnPlans}
              onClick={() => setCreateItems(true)}
            >
              Create Items
            </Button>
          )}
          {createItems && <CreateItems cats={catDetails} />}
          {createItems && (
            <CloseButton
              className={classes.closePlans}
              onClick={() => setCreateItems(false)}
            />
          )}
        </div>
      )}
      {showPage && itemDetails.length !== 0 && (
        <div className={classes.createPlans}>
          {!updateItems && (
            <Button
              className={classes.updateBtnPlans}
              onClick={() => setUpdateItems(true)}
            >
              Update Itmes
            </Button>
          )}
          {updateItems && <UpdateItems value={itemDetails} cats={catDetails} />}
          {updateItems && (
            <CloseButton
              className={classes.closePlans}
              onClick={() => setUpdateItems(false)}
            />
          )}
        </div>
      )}
    </section>
  );
};

export const getServerSideProps = async (context) => {
  const response = await fetch(`http://api.tooskaweb.com/api/get/semiplan/cat`);
  const valCats = await response.json();

  const res = await fetch(`http://api.tooskaweb.com/api/get/semiplan/item`);
  const valItem = await res.json();

  return {
    props: {
      valCats,
      valItem,
    },
  };
};

export default Plans;
