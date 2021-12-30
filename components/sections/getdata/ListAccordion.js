import { Markup } from "interweave";
import { Fragment } from "react";
import { Classnames } from "react-alice-carousel";

const ListAccordion = (props) => {
  const itemsParse = JSON.parse(props.items)
    .toString()
    .replace(/[,]+/g, "")
    .replace(/["]+/g, "");
  // const items = itemsParse
  //   .toString()
  //   .replace(/"([^"]+(?="))"/g, "$1")
  //   .split(",");

  // const test = itemsParse.toString().replace(/[,]+/g, "");

  // console.log("itemsParse", itemsParse);

  // console.log("Aaaasa", test);

  let startUl;
  let endUl;

  let startOl;
  let endOl;

  // let list = items;
  let uList = [];
  let oList = [];
  let headerOne = [];
  let headerTwo = [];
  let headerThree = [];
  let headerFour = [];
  let headerFive = [];
  let headerSix = [];
  let paragraph = [];
  let link = [];

  // var div = document.createElement("div");
  // div.innerHTML = list;
  // var text = div.textContent || div.innerText || "";

  // for (let i = 0; i < items.length; i++) {
  //   if (items[i].includes("<h1>")) {
  //     headerOne[i] = items[i];
  //   }
  //   if (items[i].includes("<h2>")) {
  //     headerTwo[i] = items[i];
  //   }
  //   if (items[i].includes("<h3>")) {
  //     headerThree[i] = items[i];
  //   }
  //   if (items[i].includes("<h4>")) {
  //     headerFour[i] = items[i];
  //   }
  //   if (items[i].includes("<h5>")) {
  //     headerFive[i] = items[i];
  //   }
  //   if (items[i].includes("<h6>")) {
  //     headerSix[i] = items[i];
  //   }
  //   if (items[i].includes("<p>")) {
  //     paragraph[i] = items[i];
  //   }
  //   if (items[i].includes("<blockquote>")) {
  //     link[i] = items[i];
  //   }

  //   if (items[i].includes("<ol>")) {
  //     startOl = i;
  //   }
  //   if (items[i].includes("</ol>")) {
  //     endOl = i;
  //   }

  //   if (items[i].includes("<ul>")) {
  //     startUl = i;
  //   }
  //   if (items[i].includes("</ul>")) {
  //     endUl = i;
  //   }
  // }

  // for (let j = startUl + 1; j < endUl; j++) {
  //   uList[j] = items[j];
  // }

  // for (let k = startOl + 1; k < endOl; k++) {
  //   oList[k] = items[k];
  // }

  // const removeTag = (val) => {
  //   let item = document.createElement("div");
  //   item.innerHTML = val;
  //   const txtContent = item.textContent || item.innerText || "";
  //   return txtContent;
  // };

  // const getLink = (aTag) => {
  //   var str = aTag;
  //   var link = str.match(/"(.*?)"/);
  //   alert(link);
  // };

  return (
    <div className={Classnames.listAccordion}>
      {/* {items.map((item, index) => (
        <Fragment key={index}>
          {item.includes("<h1>") && (
            <h1 key={index + item}>{removeTag(item)}</h1>
          )}
          {item.includes("<h2>") && (
            <h2 key={index + item}>{removeTag(item)}</h2>
          )}
          {item.includes("<h3>") && (
            <h3 key={index + item}>{removeTag(item)}</h3>
          )}
          {item.includes("<h4>") && (
            <h4 key={index + item}>{removeTag(item)}</h4>
          )}
          {item.includes("<h5>") && (
            <h5 key={index + item}>{removeTag(item)}</h5>
          )}
          {item.includes("<h6>") && (
            <h6 key={index + item}>{removeTag(item)}</h6>
          )}
          {item.includes("<p>") && <p key={index + item}>{removeTag(item)}</p>}
          {item.includes("<blockquote>") && (
            <a href={item.match(/"(.*?)"/)} key={index + item}>
              {item}
            </a>
          )}
          {item.includes("<ul>") && (
            <ul key={index + index}>
              {uList.map((list, idx) => (
                <li key={idx + list}>{removeTag(list)}</li>
              ))}
            </ul>
          )}
          {item.includes("<ol>") && (
            <ol key={index + item}>
              {oList.map((list, idx) => (
                <li key={list + idx}>{removeTag(list)}</li>
              ))}
            </ol>
          )}
        </Fragment>
      ))} */}
      <Markup content={itemsParse} />
    </div>
  );
};

export default ListAccordion;
