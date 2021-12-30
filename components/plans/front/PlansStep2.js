import { useState } from "react";
import BasicPlans from "./BasicPlans";
import classes from "./plans-front.module.css";

import Button from "../../ui/Button";
import OfferPlans from "./OfferPlans";
import SpecialPlans from "./SpecialPlans";

import PrintValues from "./PrintValues";
import { Badge } from "react-bootstrap";

const PlansStep2 = (props) => {
  const value = props.value;
  const basic = value.plans.basic.items;
  const offer = value.plans.offer.items;
  const special = value.plans.special.items;

  const [submitBasic, setSubmitBasic] = useState(false);
  const [submitOffer, setSubmitOffer] = useState(false);
  const [submitSpecial, setSubmitSpecial] = useState(false);

  const [valueBasics, setvalueBasics] = useState([]);
  const [valueOffers, setvalueOffers] = useState([]);
  const [valueSpecials, setvalueSpecials] = useState([]);

  const [basicStep, setBasicStep] = useState(true);
  const [offerStep, setOfferStep] = useState(false);
  const [specialStep, setSpecialStep] = useState(false);

  const [printStep, setPrintStep] = useState(false);
  const [printValues, setPrintValues] = useState({
    basic: [],
    offer: [],
    special: [],
  });

  const [printSec, setPrintSec] = useState(false);

  let basics = [];

  for (let i = 0; i < basic.length; i++) {
    basics[i] = (
      <BasicPlans
        submitBasic={submitBasic}
        key={i}
        number={i}
        value={basic[i]}
        valueBasics={valueBasics}
      />
    );
  }

  let offers = [];

  for (let i = 0; i < offer.length; i++) {
    offers[i] = (
      <OfferPlans
        submitOffer={submitOffer}
        key={i}
        number={i}
        value={offer[i]}
        valueOffers={valueOffers}
      />
    );
  }

  let specials = [];

  for (let i = 0; i < special.length; i++) {
    specials[i] = (
      <SpecialPlans
        submitSpecial={submitSpecial}
        key={i}
        number={i}
        value={special[i]}
        valueSpecials={valueSpecials}
      />
    );
  }

  const getBasicsHandler = () => {
    setSubmitBasic(true);
    const basicVal = valueBasics.filter((item) => item.name !== "");
    printValues.basic = basicVal;

    setOfferStep(true);
  };

  const getOffersHandler = () => {
    const offerVal = valueOffers.filter((item) => item.name !== "");
    printValues.offer = offerVal;

    setSpecialStep(true);
    setSubmitOffer(true);
  };

  const getSpecialsHandler = () => {
    const specialVal = valueSpecials.filter((item) => item.name !== "");
    printValues.special = specialVal;
    setSubmitSpecial(true);
    setPrintStep(true);
  };

  const printHandler = () => {
    setPrintSec(true);
  };

  return (
    <div className={classes.step2}>
      {basicStep && !printSec && (
        <div className={classes.steps}>
          <h2>امکانات پایه</h2>
          <div className={classes.itemsSec}>{basics}</div>
          <div className={classes.actions}>
            <Button onClick={getBasicsHandler}>مرحله بعد</Button>
          </div>
          <Badge className={classes.back} onClick={props.backStep1}>
            {" "}
            بازگشت
          </Badge>
        </div>
      )}
      {offerStep && !printSec && (
        <div className={classes.steps}>
          <h2>امکانات پیشنهادی</h2>
          <div className={classes.itemsSec}>{offers}</div>
          <div className={classes.actions}>
            <Button onClick={getOffersHandler}>مرحله بعد</Button>
          </div>
          <Badge className={classes.back} onClick={() => setBasicStep(true)}>
            {" "}
            بازگشت
          </Badge>
        </div>
      )}
      {specialStep && !printSec && (
        <div className={classes.steps}>
          <h2>امکانات اختصاصی</h2>
          <div className={classes.itemsSec}>{specials}</div>
          <div className={classes.actions}>
            <Button onClick={getSpecialsHandler}>مرحله بعد</Button>
          </div>
          <Badge className={classes.back} onClick={() => setOfferStep(true)}>
            {" "}
            بازگشت
          </Badge>
        </div>
      )}
      {printStep && !printSec && (
        <div className={classes.actions}>
          <Button onClick={printHandler}>تایید و دیدن نتایج</Button>
        </div>
      )}
      {printSec && (
        <PrintValues value={printValues} backStep1={props.backStep1} />
      )}
    </div>
  );
};

export default PlansStep2;
